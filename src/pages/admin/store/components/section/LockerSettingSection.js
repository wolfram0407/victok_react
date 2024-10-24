import { Empty, Modal, Table } from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { numberValueGetter } from "../../../../../utils/utils";
import LockerSettingTableColumn from "../../../../user/lockerSetting/components/coloumn/LockerSettingTableColumn";
import LockerCreateModal from "../../../../user/lockerSetting/components/organism/LockerCreateModal";

const LockerSettingSection = ({ user_idx }) => {
  const [lockers, setLockers] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [target, setTarget] = useState(null);

  const initPrice = Array.from({ length: 6 }, () => "-");

  const { refetch } = useQuery(
    ["lockerData"],
    async () => {
      const formData = {
        column: "idx",
        order: "desc",
        page: lockers.page,
        user_idx,
        amount: 10,
      };
      const { data } = await API.get("/admin/locker-type", {
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
              `${numberValueGetter(
                deepitem.charge,
                "원"
              )} / ${numberValueGetter(deepitem.period, "일")}
              / ${numberValueGetter(deepitem.deposit, "원")}`
          ),
          dday: item.dday.split(",").join(" / "),
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
      },
    }
  );

  const onDeleteMutation = useMutation(
    () =>
      API.post("/locker/locker-type-delete", {
        idx: selectedIds.join(","),
        ...(user_idx && { user_idx }),
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
    await onDeleteMutation.mutateAsync();
  };

  const onSelectChange = (id) => {
    setSelectedIds(id);
  };
  const rowSelection = {
    selectedIds,
    onChange: onSelectChange,
  };

  const onClickModify = (row) => {
    setTarget(row);
    setIsOpenCreateModal(true);
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setLockers((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [lockers.page]);

  return (
    <>
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
      >
        <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
          라카 구분
        </TextAtom>
        <RowWrapper
          styles={css`
            justify-content: flex-end;
          `}
          marginBottom="2rem"
        >
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
      </RowWrapper>
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
        admin
        data={lockers.data}
        target={target}
        setTarget={setTarget}
        setNoData={() => null}
        user_idx={user_idx}
      />
    </>
  );
};

export default LockerSettingSection;
