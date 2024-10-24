import styled, { css } from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Empty, Modal, Table } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";

import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import messageLoadTableColumn from "../column/messageLoadTableColumn";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import BasicButton from "../../../../../components/atom/BasicButton";
import { API } from "../../../../../utils/api";
import { queryClient } from "../../../../../App";

const Container = styled.div`
  width: 40rem;
  /* height: 42rem; */
  position: absolute;
  top: 0;
  left: 3.2rem;
  border: 0.1rem solid ${color.darkGrey};
  z-index: 10;
  background-color: ${color.white};
  padding-bottom: 2.4rem;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 2rem 1.6rem 2.4rem;
  border-bottom: 0.1rem solid ${color.border};
  margin-bottom: 2.2rem;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0 2rem;
`;

const MessageLoadBox = ({
  setIsLoadBox,
  setMessageInput,
  setFiles,
  templates,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const onSelectChange = (selectedIds) => {
    setSelectedIds(selectedIds);
  };
  const rowSelection = {
    selectedIds,
    onChange: onSelectChange,
  };

  const onDeleteMutation = useMutation(
    (data) => API.post("/message/message-template-delete", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("messageTemplate");
        setSelectedIds([]);
      },
      onError: (error) => {
        let displayError;
        if (axios.isAxiosError(error)) {
          displayError =
            error.response.data + " / " + error.response.statusText;
        } else {
          displayError = error;
        }
        Modal.error({
          title: "삭제 실패",
          content: displayError,
          okText: "확인",
        });
      },
    }
  );

  const onClickDelete = () => {
    onDeleteMutation.mutate({ idxs: selectedIds });
  };

  const onClickData = (data) => {
    setMessageInput(data.msg);
    if (data.images) {
      const parsedImages =
        typeof data.images === "string" ? JSON.parse(data.images) : data.images;
      if (parsedImages.length > 0) {
        setFiles(parsedImages.map((image) => ({ url: image })));
      }
    } else {
      setFiles([]);
    }
    setIsLoadBox(false);
  };

  return (
    <Container>
      <Header>
        <TextAtom fontSize={"1.6rem"}>저장된 메시지</TextAtom>
        <CloseOutlined
          style={{ fontSize: "1.6rem", cursor: "pointer" }}
          onClick={() => setIsLoadBox(false)}
        />
      </Header>
      <Wrapper>
        <RowWrapper
          marginBottom={"0.6rem"}
          styles={css`
            justify-content: flex-end;
          `}
        >
          <TextAtom fontSize={"1.4rem"} fontWeight={500}>
            {`(${templates.length}/10)`}
          </TextAtom>
          {selectedIds.length !== 0 && (
            <BasicButton
              styles={css`
                color: ${color.red};
              `}
              size="small"
              marginleft={"0.6rem"}
              onClick={onClickDelete}
            >
              선택 삭제
            </BasicButton>
          )}
        </RowWrapper>
        <Table
          rowSelection={rowSelection}
          columns={messageLoadTableColumn({ onClickData })}
          dataSource={templates}
          // onChange={}
          style={{ borderTop: `2px solid ${color.mainBlue}` }}
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
      </Wrapper>
    </Container>
  );
};

export default MessageLoadBox;
