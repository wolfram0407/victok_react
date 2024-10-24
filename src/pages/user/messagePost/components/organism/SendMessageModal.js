import { Modal } from "antd";
import styled, { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 4rem 0 1rem 0;
`;

const SendMessageModal = ({
  open,
  onClickConfirmListBtn,
  onClickMoreSendMessageBtn,
}) => {
  return (
    <Modal open={open} closable={false} footer={[]} maskClosable={false}>
      <Container>
        <TextAtom fontSize={"2rem"} fontWeight="bold" marginBottom={"6rem"}>
          메시지 전송이 완료되었습니다.
        </TextAtom>
        <RowWrapper
          styles={css`
            justify-content: space-between;
            gap: 2rem;
          `}
        >
          <BasicButton
            size={"large"}
            styles={css`
              border-color: ${color.mainBlue};
              color: ${color.mainBlue};
              font-weight: 500;
            `}
            onClick={onClickConfirmListBtn}
          >
            전송내역 확인
          </BasicButton>
          <BasicButton
            size={"large"}
            focused
            styles={css`
              font-weight: 500;
            `}
            onClick={onClickMoreSendMessageBtn}
          >
            메시지 더 보내기
          </BasicButton>
        </RowWrapper>
      </Container>
    </Modal>
  );
};

export default SendMessageModal;
