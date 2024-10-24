import { Divider, Empty, Modal, Table } from "antd";
import { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../../../../App";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import expiredStoreTableColumn from "../column/expiredStoreTableColumn";
import { useEffect } from "react";

const ExpiredStoreModal = ({ open, onCancel }) => {
  const [store, setStore] = useState({
    data: [],
    total: 0,
    page: 1,
  });

  const { refetch: listRefetch } = useQuery(
    ["paymentExpiredList", open],
    async () => {
      if (!open) return;
      return API.get("/admin/payment-expire-list", {
        params: { page: store.page },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total } = data;
        setStore((prev) => ({
          ...prev,
          data: list.map((store) => ({ ...store, key: store.idx })),
          total,
        }));
      },
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setStore((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  const deleteMutation = useMutation(
    (data) => API.post("/admin/payment-expire-delete", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery(["paymentExpiredList", open]);
      },
    }
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      return listRefetch();
    }, 300);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [store.page]);

  const onClickDelete = (idx) => {
    Modal.confirm({
      title: "가맹점 삭제",
      content: "삭제하시겠습니까?",
      cancelText: "취소",
      okText: "삭제",
      onOk: () => deleteMutation.mutate({ idx }),
    });
  };

  return (
    <Modal
      open={open}
      title={`만료예정 가맹점`}
      onCancel={onCancel}
      footer={[]}
      bodyStyle={{
        minHeight: "42rem",
      }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "1.6rem", marginBottom: "2.4rem" }} />
      <TextAtom fontSize={"1.2rem"} marginBottom="0.8rem">
        총 <span style={{ color: color.gold }}>{store.total}</span> 건
      </TextAtom>
      <Table
        columns={expiredStoreTableColumn({ onClickDelete })}
        dataSource={store.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: store.total,
          pageSize: 10,
          showSizeChanger: false,
        }}
        showSorterTooltip={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"No Data"}
            />
          ),
        }}
      />
    </Modal>
  );
};

export default ExpiredStoreModal;
