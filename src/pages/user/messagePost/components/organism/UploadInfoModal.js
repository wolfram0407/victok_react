import styled, { css } from "styled-components";
import { Divider, Modal } from "antd";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";

const Container = styled.div`
  width: 100%;
  padding: 0 1.2rem;
`;

const UploadInfoModal = ({ open, onCancel }) => {
  return (
    <Modal
      forceRender
      open={open}
      onCancel={onCancel}
      title={`이미지 첨부 가이드`}
      footer={[]}
      style={{ minWidth: "66rem" }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: 0 }} />
      <Container>
        <TextAtom fontSize={"1.4rem"} fontWeight={600} marginBottom="0.8rem">
          이미지 파일 형식은{" "}
          <span style={{ color: color.red }}>JPG, PNG, GIF</span> 만 가능합니다.
        </TextAtom>
        <TextAtom
          fontSize={"1.4rem"}
          fontWeight={400}
          color={color.darkGrey}
          marginBottom="2rem"
        >
          * 움직이는 GIF는 동작 없이 한 컷만 전송
        </TextAtom>
        <TextAtom fontSize={"1.4rem"} fontWeight={600} marginBottom="0.2rem">
          이미지 사이즈는 가로 기준 최대{" "}
          <span style={{ color: color.red }}>640pixel</span> 입니다.
        </TextAtom>
        <TextAtom fontSize={"1.4rem"} fontWeight={600} marginBottom="0.8rem">
          640픽셀보다 큰 이미지는 640픽셀로 자동 조정되어 발송됩니다.
        </TextAtom>
        <TextAtom
          fontSize={"1.4rem"}
          fontWeight={400}
          color={color.darkGrey}
          marginBottom="0.4rem"
          styles={css`
            white-space: pre-wrap;
          `}
        >
          {` * 크기 조정 시 가로×세로 비율이 약 1:2 를 초과하는 경우 용량 초과로 첨부되지 않을 수 있으니
    확인 후 등록 바랍니다.`}
        </TextAtom>
        <TextAtom fontSize={"1.4rem"} fontWeight={600}>
          조정된 이미지는 900KB까지 첨부 가능합니다.
        </TextAtom>
      </Container>
      <Divider style={{ marginBottom: 0 }} />
    </Modal>
  );
};

export default UploadInfoModal;
