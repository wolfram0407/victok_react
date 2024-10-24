import { AutoComplete, Empty, Modal, Table } from "antd";
import { useCallback, useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled, { css } from "styled-components";
import { useMutation, useQuery } from "react-query";

import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import WhiteBoxLayout from "../../../../../components/layouts/WhiteBoxLayout";
import StatusLabel from "../../../../../components/molecule/StatusLabel";
import ExcelButton from "../../../../../components/organism/ExcelButton";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { MainContext } from "../../utils/mainContext";
import LockerCurrentColumn from "../column/LockerCurrentColumn";
import {
  chargeConvert,
  depositConvert,
  lockerListResultFormat,
  numberToLocaleString,
  periodConvert,
} from "../../../../../utils/utils";
import { queryClient } from "../../../../../App";
import useGetLockerList from "../../../../../hooks/useGetLockerList";
import useGetArrayMutation from "../../utils/getArrayMutation";
import AdModalContent from "../../../../../components/organism/AdModalContent";
import LockerArrayComponent from "../../../../../components/organism/LockerArrayComponent";

const { Column } = Table;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;

const statusList = [
  { id: 1, body: "이용 가능", color: "" },
  { id: 2, body: "이용중", color: color.skyBlue },
  { id: 3, body: "고장 및 이용 불가", color: color.grey },
];
const LockerCurrentSection = ({ setCreateLockerUserModal }) => {
  const {
    selectedLockerType,
    lockerType,
    setSelectedLockerType,
    lockerArrayData,
    setLockerArrayData,
  } = useContext(MainContext);
  const { grade } = useOutletContext();

  const [focusedTab, setFocusedTab] = useState("list");
  const [selectedIds, setSelectedIds] = useState([]);
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
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

  const [selectedLockerIdx, setSelectedLockerIdx] = useState("");
  const [selectedLockerIdxUser, setSelectedLockerIdxUser] = useState(null);

  const navigate = useNavigate();

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

  const onSelectChange = (selectedIds) => {
    setSelectedIds(selectedIds);
  };

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: onSelectChange,
  };

  // 라카 현황에서 리스트 항목 리스트 불러오기
  const { isLoading: currentDataLoading, refetch: currentDataRefetch } =
    useGetLockerList({
      dataKey: "lockerCurrentData",
      formData: {
        column: convertColumn(currentData.sort.column),
        order: currentData.sort.order,
        keyword: currentData.keyword,
        page: String(currentData.page),
        amount: "10",
      },
      onSuccess: (data) => {
        const result = lockerListResultFormat(data.list);
        setCurrentData((prev) => ({
          ...prev,
          data: result,
          total: data.total,
          lockerCount: data.lockerCount,
          expiredCount: data.expiredCount,
          allCount: data.allCount,
        }));
      },
    });

  // 라카 현황에서 배열 항목 리스트 불러오기
  const getArrayMutation = useGetArrayMutation(
    selectedLockerType,
    setLockerArrayData
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

  const getSelectUserInfo = (idx) => {
    setSelectedLockerIdxUser(idx);
    selectedUserRefetch();
  };

  // '리스트' 테이블에서 수납 여부 바꿀 때 실행되는 Mutation
  const changeMutation = useMutation(
    (data) => API.put("/locker/locker-paid", data).then(() => data),
    {
      onSuccess: (data) => {
        const displayData = "lockerCurrentData";
        queryClient.fetchQuery(displayData);
      },
    }
  );
  const onPaidChange = async (idx, paid) => {
    const state = paid === "미수납" ? "수납" : "미수납";
    changeMutation.mutate({ locker_idx: idx, paid: state });
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
      API.put("/locker/locker-available", { locker_type, locker_number }).then(
        () => callback
      ),
    {
      onSuccess: (callback) => {
        getArrayMutation.mutate();
        callback((prev) => !prev);
      },
    }
  );

  const onFixMutation = useMutation(
    ({ locker_type, locker_number, callback }) =>
      API.put("/locker/locker-fix", { locker_type, locker_number }).then(
        () => callback
      ),
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

  const onCurrentKeywordChange = (str) => {
    setCurrentData((prev) => ({
      ...prev,
      page: 1,
      keyword: str,
    }));
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
        const cachedKey = ["lockerCurrentData", "lockerRemainData"];
        cachedKey.forEach((key) => {
          queryClient.fetchQuery(key);
        });
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

  // '리스트'로 현황 표시 바꿀 때 리스트 데이터 reFetch
  useEffect(() => {
    if (focusedTab === "list") {
      const debounce = setTimeout(() => {
        return currentDataRefetch();
      }, 300);
      return () => clearTimeout(debounce);
    }
    // eslint-disable-next-line
  }, [focusedTab, currentData.keyword, currentData.page, currentData.sort]);

  // '배열'로 현황 표시 바꿀 때 배열 데이터 받아오기
  useEffect(() => {
    if (focusedTab === "array") {
      getArrayMutation.mutate();
    }
    // eslint-disable-next-line
  }, [selectedLockerType, focusedTab]);

  return (
    <WhiteBoxLayout>
      <Row marginBottom="3rem">
        <RowWrapper>
          <TextAtom
            fontSize={"2.2rem"}
            fontWeight="bold"
            marginRight={"0.8rem"}
          >
            라카 현황
          </TextAtom>
          <TextAtom
            fontSize="2rem"
            marginRight={"2.4rem"}
            styles={css`
              span {
                color: ${color.gold};
              }
            `}
          >
            ( 이용중{" "}
            <span>{numberToLocaleString(currentData.lockerCount)}</span> / 만료{" "}
            <span>{numberToLocaleString(currentData.expiredCount)}</span> / 전체{" "}
            <span>{numberToLocaleString(currentData.allCount)}</span>)
          </TextAtom>
          <BasicButton
            focused={focusedTab === "list"}
            onClick={() => setFocusedTab("list")}
            marginright="0.6rem"
          >
            리스트
          </BasicButton>
          <BasicButton
            focused={focusedTab === "array"}
            onClick={() => setFocusedTab("array")}
            marginright="1.2rem"
          >
            배열
          </BasicButton>
          {focusedTab === "list" && (
            <ExcelButton
              sheetColumn={[
                { header: "회원 이름", key: "name" },
                { header: "휴대폰 번호", key: "phone" },
                { header: "라카 구분", key: "locker_type" },
                { header: "라카 번호", key: "locker_number" },
                { header: "금액", key: "charge" },
                { header: "기간", key: "period" },
                { header: "보증금", key: "deposit" },
                { header: "수납 여부", key: "paid" },
                { header: "시작일", key: "start_date" },
                { header: "종료일", key: "end_date" },
                { header: "사용 기간(일)", key: "used" },
                { header: "남은 기간(일)", key: "remain" },
                { header: "상태", key: "status" },
              ]}
              sheetName={"라카 현황"}
              getUrl={"/locker/locker-list-excel"}
              formData={{
                column: convertColumn(currentData.sort.column),
                order: currentData.sort.order,
                keyword: currentData.keyword,
              }}
              dataType={"locker"}
              customOnClick={({ trigger }) => {
                if (grade === 0) {
                  Modal.info({
                    title: "유료 회원 전용 기능",
                    content: <AdModalContent />,
                    okText: "이용권 구매하기",
                    onOk: () => {
                      // navigate("/setting?tab=payment");
                      navigate("/goodsInfo");
                    },
                    closable: true,
                  });
                } else {
                  if (currentData.data.length === 0) {
                    return;
                  }
                  trigger(true);
                }
              }}
              dataFormatter={(data) => {
                return data.map((item) => ({
                  ...item,
                  charge: chargeConvert(item.charge),
                  period: periodConvert(item),
                  deposit: depositConvert(item.deposit),
                  status: item.remain < 0 ? "만료됨" : "-",
                }));
              }}
              grade={grade}
              column={convertColumn(currentData.sort.column)}
              order={currentData.sort.order}
              keyword={currentData.keyword}
            />
          )}
        </RowWrapper>

        {focusedTab === "list" && (
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
        {focusedTab === "array" && (
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
      </Row>
      {focusedTab === "list" && (
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
      {focusedTab === "array" && (
        <LockerArrayComponent
          key={selectedLockerType}
          data={lockerArrayData}
          lockerType={lockerType}
          selectedLockerType={selectedLockerType}
          onSwitch={onSwitch}
          onClickBox={(item) =>
            item.name
              ? getSelectUserInfo(item.idx)
              : setCreateLockerUserModal({
                  locker_type: selectedLockerType.idx,
                  locker_number: item.locker_number,
                })
          }
          onClickExtend={(item) =>
            item.name
              ? getSelectLockerInfo(item.idx)
              : setCreateLockerUserModal({
                  locker_type: "",
                  locker_number: "",
                })
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
    </WhiteBoxLayout>
  );
};

export default LockerCurrentSection;
