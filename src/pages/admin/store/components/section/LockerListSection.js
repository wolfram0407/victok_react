import { AutoComplete, Empty, Modal, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import StatusLabel from "../../../../../components/molecule/StatusLabel";
import LockerArrayComponent from "../../../../../components/organism/LockerArrayComponent";
import TabList from "../../../../../components/organism/TabList";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { lockerListResultFormat } from "../../../../../utils/utils";
import LockerCurrentColumn from "../../../../user/Main/components/column/LockerCurrentColumn";
import CreateLockerUserModal from "../../../../user/Main/components/organism/CreateLockerUserModal";
import useGetArrayMutation from "../../../../user/Main/utils/getArrayMutation";

const { Column } = Table;

const tabList = [
  { id: 1, value: "list", name: "리스트" },
  { id: 2, value: "array", name: "배열" },
];

const statusList = [
  { id: 1, body: "이용 가능", color: "" },
  { id: 2, body: "이용중", color: color.skyBlue },
  { id: 3, body: "고장 및 이용 불가", color: color.grey },
];

const LockerListSection = ({
  user_idx,
  lockerType,
  selectedLockerType,
  setSelectedLockerType,
}) => {
  const [currentTab, setCurrentTab] = useState("list");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  // 라카 현황 내 '리스트' 관련 State
  const [currentData, setCurrentData] = useState({
    data: [],
    total: 0,
    lockerCount: 0,
    expiredCount: 0,
    allCount: 0,
    page: 1,
    keyword: "",
    sort: {
      column: "idx",
      order: "desc",
    },
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedLockerIdx, setSelectedLockerIdx] = useState("");
  const [selectedLockerIdxUser, setSelectedLockerIdxUser] = useState(null);
  const [createLockerUserModal, setCreateLockerUserModal] = useState(null);
  const [lockerArrayData, setLockerArrayData] = useState([]);

  const convertColumn = (value) => {
    return value;
    // switch (value) {
    //   case "name":
    //     return "customer.name";
    //   case "phone":
    //     return "customer.phone";
    //   case "charge":
    //     return "charge.charge";
    //   case "deposit":
    //     return "charge.deposit";
    //   default:
    //     return `locker.${value}`;
    // }
  };

  const onClickTab = (value) => {
    if (currentTab === value) {
      return;
    }
    setCurrentTab(value);
  };

  const onCurrentKeywordChange = (str) => {
    setCurrentData((prev) => ({
      ...prev,
      page: 1,
      keyword: str,
    }));
  };

  const { isLoading: currentDataLoading, refetch: currentDataRefetch } =
    useQuery(
      "adminLockerList",
      async () =>
        await API.get("/locker/locker-list", {
          params: {
            user_idx,
            column: convertColumn(currentData.sort.column),
            order: currentData.sort.order,
            keyword: currentData.keyword,
            page: currentData.page,
            amount: "10",
          },
        }).then((res) => res.data),
      {
        onSuccess: (data) => {
          // console.log(data, "1");
          const result = lockerListResultFormat(data.list);
          setCurrentData((prev) => ({
            ...prev,
            data: result,
            total: data.total,
          }));
        },
      }
    );

  // 라카 현황에서 배열 항목 리스트 불러오기
  const getArrayMutation = useGetArrayMutation(
    selectedLockerType,
    setLockerArrayData,
    user_idx
  );

  const onSelectChange = (selectedIds) => {
    setSelectedIds(selectedIds);
  };

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: onSelectChange,
  };

  const deleteUsersMutation = useMutation(
    (data) => API.post("/locker/locker-delete", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "이용자 삭제 완료",
          content: "선택하신 이용자가 삭제되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("adminLockerList");
        getArrayMutation.mutate();
        setSelectedIds([]);
      },
    }
  );

  const onClickDelete = () => {
    const formData = {
      idx: selectedIds.join(","),
    };
    deleteUsersMutation.mutate(formData);
  };

  // '리스트' 테이블에서 수납 여부 바꿀 때 실행되는 Mutation
  const changeMutation = useMutation(
    (data) => API.put("/locker/locker-paid", data),
    {
      onMutate: (data) => {
        const displayData = "adminLockerList";
        queryClient.fetchQuery(displayData);
      },
    }
  );

  const onPaidChange = async (idx, paid) => {
    changeMutation.mutate({ locker_idx: idx, paid });
  };

  // '배열'에서 타이틀 좌/우 버튼 클릭시 실행
  const onSwitch = (type) => {
    const now = lockerType.findIndex(
      (i) => i.locker_type === selectedLockerType.locker_type
    );
    if (type === "next") {
      if (now < lockerType.length - 1) {
        setSelectedLockerType(lockerType[now + 1]);
      }
    } else {
      if (now > 0) {
        setSelectedLockerType(lockerType[now - 1]);
      }
    }
  };

  const onAvailableMutation = useMutation(
    ({ locker_type, locker_number, callback }) =>
      API.put("/admin/locker-available", {
        user_idx,
        locker_type,
        locker_number,
      }).then(() => callback),
    {
      onSuccess: (callback) => {
        getArrayMutation.mutate();
        callback((prev) => !prev);
      },
    }
  );

  const onFixMutation = useMutation(
    ({ locker_type, locker_number, callback }) =>
      API.put("/admin/locker-fix", {
        user_idx,
        locker_type,
        locker_number,
      }).then(() => callback),
    {
      onSuccess: (callback) => {
        getArrayMutation.mutate();
        callback((prev) => !prev);
      },
    }
  );

  const onClickTurnOn = ({ locker_type, locker_number, callback }) => {
    const formData = {
      locker_type,
      locker_number,
      callback,
    };
    onAvailableMutation.mutate(formData);
  };

  const onClickTurnOff = ({ locker_type, locker_number, callback }) => {
    const formData = {
      locker_type,
      locker_number,
      callback,
    };
    onFixMutation.mutate(formData);
  };

  // 라카현황 리스트 테이블 내에서 각 테이블 로우의 '회원이름' 눌렀을 때,
  // 선택된 라커 정보 불러오는 쿼리
  const { refetch: selectedUserRefetch } = useQuery(
    ["selectedUserInfo", selectedLockerIdxUser],
    async () => {
      if (!selectedLockerIdxUser) return;
      return await API.get("/locker/user-info", {
        params: { locker_idx: selectedLockerIdxUser },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setCreateLockerUserModal(data);
      },
    }
  );

  // 라카현황 리스트 테이블 내에서 각 테이블 로우의 '연장' 버튼 눌렀을 때,
  // 선택된 라커 정보 불러오는 쿼리
  const { refetch: selectedLockerRefetch } = useQuery(
    ["selectLockerInfo", selectedLockerIdx],
    async () => {
      if (!selectedLockerIdx) return;
      return await API.get("/locker/locker-info", {
        params: { locker_idx: selectedLockerIdx },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setCreateLockerUserModal(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const getSelectLockerInfo = (idx, row) => {
    setSelectedLockerIdx(idx);
    selectedLockerRefetch();
  };

  const getSelectUserInfo = (idx) => {
    setSelectedLockerIdxUser(idx);
    selectedUserRefetch();
  };
  const onChangeCurrent = useCallback((pagination, filters, extra) => {
    setCurrentData((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setCurrentData((prev) => ({
        ...prev,
        sort: {
          column: extra.field,
          order: extra.order === "ascend" ? "asc" : "desc",
        },
      }));
    } else {
      setCurrentData((prev) => ({
        ...prev,
        sort: {
          column: "idx",
          order: "desc",
        },
      }));
    }
  }, []);

  // '리스트'로 현황 표시 바꿀 때 리스트 데이터 reFetch
  useEffect(() => {
    if (currentTab === "list") {
      const debounce = setTimeout(() => {
        return currentDataRefetch();
      }, 300);
      return () => clearTimeout(debounce);
    }
    // eslint-disable-next-line
  }, [currentTab, currentData.keyword, currentData.page, currentData.sort]);

  useEffect(() => {
    if (currentTab === "array") {
      getArrayMutation.mutate();
    }
    // eslint-disable-next-line
  }, [selectedLockerType, currentTab]);

  return (
    <>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        라카 현황
      </TextAtom>
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
        marginBottom="2rem"
      >
        <TabList
          list={tabList}
          onChange={onClickTab}
          currentTab={currentTab}
          borderRadius={"0.2rem"}
          gap="1rem"
          marginBottom={"0"}
        />
        {currentTab === "list" && (
          <RowWrapper
            styles={css`
              gap: 1rem;
            `}
          >
            <AutoComplete
              style={{ width: 250 }}
              placeholder="이름/연락처/태그/메모 빠른 검색"
              value={currentData.keyword}
              onChange={onCurrentKeywordChange}
              onSelect={onCurrentKeywordChange}
              options={autoCompleteOptions}
              onSearch={(str) => {
                let newOptions = [];
                const optionMapper = (type) => {
                  const targetArr = currentData.data
                    .map((i) => i[type])
                    .filter((i) => i !== undefined);
                  if (!targetArr) return [];
                  return targetArr
                    .map((t) => {
                      if (t.includes(str)) {
                        return { value: t, label: t };
                      } else {
                        return null;
                      }
                    })
                    .filter((i) => i !== null);
                };
                ["name", "phone", "memo"].forEach((type) => {
                  const result = optionMapper(type);
                  if (result.length > 0) {
                    return (newOptions = [...newOptions, ...result]);
                  }
                });
                setAutoCompleteOptions(!str ? [] : newOptions);
              }}
            />
            <BasicButton
              onClick={() =>
                setCreateLockerUserModal({ locker_type: "", locker_number: "" })
              }
            >
              이용자 추가
            </BasicButton>
            {selectedIds.length !== 0 && (
              <BasicButton
                styles={css`
                  border-color: ${color.red};
                  color: ${color.red};
                `}
                onClick={onClickDelete}
              >
                삭제
              </BasicButton>
            )}
          </RowWrapper>
        )}
        {currentTab === "array" && (
          <RowWrapper>
            {statusList.map((item, index) => (
              <StatusLabel
                key={item.id}
                circleColor={item.color}
                marginRight={index === statusList.length - 1 ? 0 : "1.6rem"}
              >
                {item.body}
              </StatusLabel>
            ))}
          </RowWrapper>
        )}
      </RowWrapper>
      {currentTab === "list" && (
        <Table
          rowSelection={rowSelection}
          columns={LockerCurrentColumn({
            onPaidChange,
            getSelectLockerInfo,
            getSelectUserInfo,
          })}
          dataSource={currentData.data}
          onChange={onChangeCurrent}
          style={{ borderTop: `2px solid ${color.mainBlue}` }}
          pagination={{
            total: currentData.total,
            pageSize: 10,
            showSizeChanger: false,
            current: currentData.page,
          }}
          rowClassName={(record, index) =>
            record.remain < 0 ? "grey" : "white"
          }
          showSorterTooltip={false}
          scroll={{ x: 1700 }}
          loading={currentDataLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"No Data"}
              />
            ),
          }}
        >
          <Column
            title="관리"
            key="idx"
            render={() => (
              <BasicButton type="primary" size="middle">
                관리
              </BasicButton>
            )}
          />
        </Table>
      )}
      {currentTab === "array" && (
        <LockerArrayComponent
          data={lockerArrayData}
          lockerType={lockerType}
          selectedLockerType={selectedLockerType}
          onSwitch={onSwitch}
          onClickBox={(item) =>
            item.name
              ? getSelectUserInfo(item.idx)
              : setCreateLockerUserModal({
                  locker_type: "",
                  locker_number: "",
                })
          }
          onClickExtend={(item) =>
            item.name
              ? getSelectLockerInfo(item.idx)
              : setCreateLockerUserModal({ locker_type: "", locker_number: "" })
          }
          onClickTurnOn={(item, callback) =>
            onClickTurnOn({
              locker_type: selectedLockerType.locker_type,
              locker_number: item.locker_number,
              callback,
            })
          }
          onClickTurnOff={(item, callback) =>
            onClickTurnOff({
              locker_type: selectedLockerType.locker_type,
              locker_number: item.locker_number,
              callback,
            })
          }
          deleteMutation={deleteUsersMutation}
        />
      )}
      <CreateLockerUserModal
        admin
        open={createLockerUserModal}
        setCreateLockerUserModal={setCreateLockerUserModal}
        user_idx={user_idx}
        lockerType={lockerType}
      />
    </>
  );
};

export default LockerListSection;
