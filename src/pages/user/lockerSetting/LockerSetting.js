import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import TextAtom from "../../../components/atom/TextAtom";
import styled, { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import { useEffect, useState } from "react";
import { color } from "../../../styles/theme";
import { Empty, Modal, Table } from "antd";
import LockerSettingTableColumn from "./components/coloumn/LockerSettingTableColumn";
import { useCallback } from "react";
import LockerCreateModal from "./components/organism/LockerCreateModal";
import { API } from "../../../utils/api";
import axios from "axios";
import { numberToLocaleString } from "../../../utils/utils";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../../App";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const initPrice = Array.from({ length: 6 }, () => "-");

const LockerSetting = () => {
  const { grade } = useOutletContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [lockers, setLockers] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [target, setTarget] = useState(null);
  const [noData, setNoData] = useState(false);
  const onFirst = () => {
    Modal.info({
      title: "안내",
      content: (
        <div>
          <p>설정된 라카가 없습니다.</p>
          <p>라카 설정을 필요로 합니다. 라카를 설정해 주세요.</p>
        </div>
      ),
      okButtonProps: { block: true },
      okText: "설정하러 가기",
      onOk: () => setIsOpenCreateModal(true),
      closable: true,
    });
  };

  const { refetch } = useQuery(
    ["lockerData"],
    async () => {
      const formData = {
        column: "idx",
        order: "desc",
        page: lockers.page,
        amount: 10,
      };
      const { data } = await API.get("/locker/locker-type", {
        params: formData,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        const result = data.chargeList.map((item) => ({
          ...item,
          ...initPrice.map((deepitem) => deepitem),
          ...item.charge.map(
            (deepitem) =>
              `${numberToLocaleString(deepitem.charge)} / ${deepitem.period}
                   / ${numberToLocaleString(deepitem.deposit)}`
          ),
          key: item.idx,
        }));
        if (result.length === 0) {
          if (lockers.page !== 1) {
            setLockers((prev) => ({ ...prev, page: prev.page - 1 }));
          }
        }
        setLockers((prev) => ({
          ...prev,
          total: data.total,
          data: result,
        }));
        if (data?.chargeList?.length === 0 && !noData && lockers.page === 1) {
          setNoData(true);
        }
      },
    }
  );

  const onDeleteMutation = useMutation(
    () =>
      API.post("/locker/locker-type-delete", {
        idx: selectedIds.join(","),
      }),
    {
      onSuccess: () => {
        queryClient.fetchQuery("lockerData");
        Modal.success({
          title: "라카 구분 삭제 완료",
          content: "선택하신 라카 구분이 삭제되었습니다.",
          okText: "확인",
          onOk: () => {
            setSelectedIds([]);
          },
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "라카 구분 삭제 오류",
            content: error.response.data.message,
            okText: "확인",
          });
        }
      },
    }
  );

  const onSelectChange = (id) => {
    setSelectedIds(id);
  };
  const rowSelection = {
    selectedIds,
    onChange: onSelectChange,
  };
  const onClickDelete = () => {
    if (selectedIds.length > 0)
      Modal.confirm({
        title: "라카 구분 삭제",
        content:
          "선택하신 라카 구분을 삭제하시겠습니까?\n해당 구분에 이용자가 있을시 삭제할 수 없습니다.",
        okText: "삭제",
        onOk: () => onDelete(),
        cancelText: "취소",
        onCancel: () => console.log("취소"),
      });
  };
  const onDelete = async () => {
    onDeleteMutation.mutate();
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setLockers((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  const onClickModify = (row) => {
    // console.log(row);
    setTarget(row);
    setIsOpenCreateModal(true);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [lockers.page]);

  useEffect(() => {
    if (noData) {
      onFirst();
      // setNoData(false);
    }
  }, [noData]);

  return (
    <LoggedInLayout>
      <WhiteBoxLayout>
        <Wrapper>
          <TextAtom
            fontSize={"2.2rem"}
            fontWeight="bold"
            marginRight={"2.4rem"}
          >
            라카 설정
          </TextAtom>
          <RowWrapper>
            <BasicButton onClick={() => setIsOpenCreateModal(true)}>
              라카 구분 추가
            </BasicButton>
            {selectedIds.length !== 0 && (
              <BasicButton
                styles={css`
                  color: ${color.red};
                  border-color: ${color.red};
                `}
                marginleft="1rem"
                onClick={onClickDelete}
              >
                삭제
              </BasicButton>
            )}
          </RowWrapper>
        </Wrapper>
        <TextAtom
          fontSize={"1.6rem"}
          color={color.mainBlue}
          marginBottom="0.6rem"
          styles={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          * 요금(금액/기간/보증금)
        </TextAtom>
        <Table
          rowSelection={rowSelection}
          columns={LockerSettingTableColumn({ onClickModify })}
          dataSource={lockers.data}
          onChange={onChange}
          style={{
            borderTop: `2px solid ${color.mainBlue}`,
            overflow: "scroll",
            scrollbarWidth: "0.5rem",
          }}
          pagination={{
            total: lockers.total,
            pageSize: 10,
            showSizeChanger: false,
            current: lockers.page,
          }}
          showSorterTooltip={false}
          scroll={{ x: 1700 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"No Data"}
              />
            ),
          }}
        />
        <LockerCreateModal
          open={isOpenCreateModal}
          onCancel={() => setIsOpenCreateModal(false)}
          grade={grade}
          data={lockers.data}
          target={target}
          setTarget={setTarget}
          setNoData={setNoData}
        />
      </WhiteBoxLayout>
    </LoggedInLayout>
  );
};

export default LockerSetting;
