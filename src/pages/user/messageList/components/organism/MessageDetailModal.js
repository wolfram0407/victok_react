import { Divider, Empty, Modal, Table } from "antd";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import messageDetailTableColumn from "../column/messageDetailTableColumn";

const Container = styled.div`
  width: 100%;
  padding: 0 1rem;
`;

const MessageDetailModal = ({ open, idx, user_idx, onCancel }) => {
  const [message, setMessage] = useState({
    data: [],
    total: 0,
    page: 1,
  });

  useQuery(
    ["messageResultQuery", open],
    async () => {
      if (!open) return;
      return await API.get("/message/message-result", {
        params: {
          idx,
          user_idx,
          page: message.page,
        },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total } = data;
        setMessage((prev) => ({
          ...prev,
          data: list.map((item) => ({ ...item, key: item.i })),
          total,
        }));
      },
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setMessage((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  return (
    <Modal
      forceRender
      open={open}
      onCancel={onCancel}
      title={`전송 내용 - 상세보기`}
      footer={[]}
      style={{ minWidth: "62rem" }}
      maskClosable={false}
    >
      <Divider />
      <Container>
        <TextAtom fontSize={"1.2rem"} marginBottom="0.6rem">
          총{" "}
          <span style={{ color: color.gold, fontWeight: 600 }}>
            {message.total}
          </span>{" "}
          건
        </TextAtom>
        <Table
          columns={messageDetailTableColumn()}
          dataSource={message.data}
          onChange={onChange}
          style={{ borderTop: `2px solid ${color.mainBlue}` }}
          pagination={{
            total: message.total,
            pageSize: 10,
            showSizeChanger: false,
            current: message.page,
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
      </Container>
    </Modal>
  );
};

export default MessageDetailModal;
