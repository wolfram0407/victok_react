import { Divider, Modal } from "antd";
import styled, { css } from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import DeviceLayout from "../../../../../components/layouts/DeviceLayout";
import { color } from "../../../../../styles/theme";
import {
  getByteLength,
  numberToLocaleString,
} from "../../../../../utils/utils";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-height: 40rem;
  overflow: auto;
`;

const BasicImageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 10rem;
  margin-bottom: 0.8rem;
`;

const BasicImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const MessageMoreModal = ({ open, onCancel, showMoreData }) => {
  const messageImagesLength = showMoreData.img_cnt
    ? parseInt(showMoreData.img_cnt)
    : 0;

  return (
    <Modal
      forceRender
      open={open}
      onCancel={onCancel}
      title={`전송 내용 - 더보기`}
      footer={[]}
      maskClosable={false}
    >
      <Divider />
      <Container>
        <DeviceLayout
          width={"30rem"}
          displayHeight={"50rem"}
          displayStyles={css`
            align-items: flex-start;
            padding: 2.4rem 2.4rem 1rem 2.4rem;
            justify-content: space-between;
            position: relative;
          `}
        >
          <Wrapper>
            {showMoreData.type === "MMS" &&
              [...Array(messageImagesLength)].map((item, index) => (
                <BasicImageWrapper>
                  <BasicImage
                    key={index}
                    src={require("../../../../../assets/images/basicImage.jpg")}
                    alt="x"
                  />
                </BasicImageWrapper>
              ))}
            {(showMoreData.type === "MMS" || showMoreData.type === "LMS") && (
              <TextAtom
                fontSize={"1.6rem"}
                fontWeight={700}
                marginBottom={"0.8rem"}
                styles={css`
                  white-space: pre-wrap;
                `}
              >
                {`${showMoreData.title ?? "제목없음"}`}
              </TextAtom>
            )}
            <TextAtom
              fontSize={"1.4rem"}
              fontWeight={500}
              styles={css`
                white-space: pre-wrap;
              `}
            >
              {`${showMoreData.body}`}
            </TextAtom>
          </Wrapper>
          <TextAtom
            fontSize={"1.6rem"}
            fontWeight={500}
            color={color.caption}
            styles={css`
              width: 100%;
              display: flex;
              justify-content: flex-end;
              position: absolute;
              bottom: 1.6rem;
              right: 2.4rem;
            `}
          >
            {`${numberToLocaleString(
              getByteLength(showMoreData.body.replaceAll(`\r\n`, `\n`))
            )} / 2,000bytes`}
          </TextAtom>
        </DeviceLayout>
      </Container>
    </Modal>
  );
};

export default MessageMoreModal;
