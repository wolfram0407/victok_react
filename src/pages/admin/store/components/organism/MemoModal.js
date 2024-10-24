import { Divider, Empty, Input, Modal, Table } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import memoTableColumn from "../column/memoTableColumn";

const MemoModal = ({ open, onCancel, selectedUserIdx: user_idx }) => {
  const [memoInput, setMemoInput] = useState("");
  const [memos, setMemos] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { refetch } = useQuery(
    ["getMemoQuery", open],
    async () => {
      if (!open) return;
      return API.get("/admin/user-memo", {
        params: {
          user_idx,
          page: memos.page,
        },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const { memos: memoData, total } = data;
        if (memoData.length === 0) {
          if (memos.page !== 1) {
            setMemos((prev) => ({ ...prev, page: prev.page - 1 }));
          }
        }
        setMemos((prev) => ({
          ...prev,
          data: memoData.map((memo) => ({ ...memo, key: memo.idx })),
          total,
        }));
      },
      retry: false,
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setMemos((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  const createMemoMutation = useMutation(
    (data) =>
      API.post("/admin/user-memo", data).then((res) => console.log(res)),
    {
      onSuccess: () => {
        setMemoInput("");
        queryClient.fetchQuery(["getMemoQuery", open]);
        queryClient.fetchQuery("adminStoreList");
      },
    }
  );

  const onClickAdd = () => {
    if (memoInput === "") {
      return null;
    }
    const formData = {
      user_idx,
      memo: memoInput,
    };
    createMemoMutation.mutate(formData);
  };

  const deleteMutation = useMutation(
    (data) => API.post("/admin/user-memo-delete", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery(["getMemoQuery", open]);
        queryClient.fetchQuery("adminStoreList");
      },
    }
  );

  const onClickDelete = (idx) => {
    if (!user_idx || !idx) return;
    setDeleteTarget(idx);
    const formData = {
      user_idx,
      idx,
    };

    Modal.confirm({
      title: "메모 삭제",
      content: "삭제하시겠습니까?",
      cancelText: "취소",
      okText: "삭제",
      onOk: () => deleteMutation.mutate(formData),
    });
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [memos.page]);

  return (
    <Modal
      open={open}
      title={`메모`}
      onCancel={onCancel}
      footer={[]}
      bodyStyle={{
        minHeight: "52rem",
      }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "1.6rem", marginBottom: "2.4rem" }} />
      <RowWrapper
        styles={css`
          gap: 1rem;
        `}
        marginBottom="2rem"
      >
        <Input
          value={memoInput}
          onChange={(e) => setMemoInput(e.target.value)}
          placeholder="메모 입력"
        />
        <BasicButton focused onClick={onClickAdd}>
          추가
        </BasicButton>
      </RowWrapper>
      <TextAtom fontSize={"1.2rem"} marginBottom="0.8rem">
        총 <span style={{ color: color.gold }}>{memos.total}</span> 건
      </TextAtom>
      <Table
        columns={memoTableColumn({ onClickDelete })}
        dataSource={memos.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: memos.total,
          pageSize: 10,
          showSizeChanger: false,
          current: memos.page,
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

export default MemoModal;
