import styled, { css } from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { Input, Modal } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

const { TextArea } = Input;

const DeviceWrapper = styled.div`
  width: 39rem;
  height: 74rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  padding: 2rem 1.5rem 1.6rem 1.5rem;
  border: 0.2rem solid ${color.border};
  border-radius: 5rem;
  margin-bottom: 1.6rem;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DeviceDisplayWrapper = styled.div`
  width: 100%;
  height: 64rem;
  padding: 2.5rem 2.8rem;
  border: 0.2rem solid ${color.border};
  border-radius: 1rem;
  overflow-y: auto;
  box-sizing: border-box;
`;

const DeviceTitleWrapper = styled.div`
  background-color: ${color.skyBlue};
  padding: 0.4rem;
  margin-bottom: 0.8rem;
  border-radius: 0.8rem;
`;

const DeviceBtn = styled.div`
  width: 11rem;
  height: 1.6rem;
  border: 0.2rem solid ${color.border};
  border-radius: 3.5rem;
  box-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.16);
`;

const ImgWrapper = styled.div`
  position: relative;
`;

const DeviceAreaImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
`;

const DeviceTextarea = ({
  value,
  files,
  messageByte,
  setFiles,
  titleValue,
  messageType,
  messageTypeAddBytes,
}) => {
  const bytes =
    messageType === "ad" ? messageByte + messageTypeAddBytes : messageByte;
  return (
    <DeviceWrapper>
      <Wrapper>
        <TextAtom fontSize={"1.7rem"} marginBottom="1rem">
          {`${
            files.length !== 0
              ? "포토(MMS)"
              : messageByte !== 0
              ? messageByte < 90
                ? "단문(SMS)"
                : "장문(LMS)"
              : "미리보기"
          }`}
        </TextAtom>
        <DeviceDisplayWrapper className="devicePreview">
          {files.length > 0 &&
            files.map((image, index) => (
              <ImgWrapper key={index}>
                <DeviceAreaImg
                  src={image.url}
                  alt={image.file ? image.file.name : "image" + index}
                />
                <CloseCircleFilled
                  style={{
                    fontSize: "2.4rem",
                    color: color.white,
                    position: "absolute",
                    right: ".6rem",
                    top: ".6rem",
                  }}
                  onClick={() =>
                    Modal.confirm({
                      title: "알림",
                      content: "이미지를 삭제하시겠습니까?",
                      okText: "확인",
                      onOk: () =>
                        setFiles(files.filter((i) => i.url !== image.url)),
                      cancelText: "취소",
                    })
                  }
                />
              </ImgWrapper>
            ))}
          {titleValue && (
            <DeviceTitleWrapper>
              <TextArea
                autoSize
                style={{
                  border: "none",
                  resize: "none",
                  padding: 0,
                  borderRadius: "0.8rem",
                  // backgroundColor: color.skyBlue,
                  // textAlign: "center",

                  height: "fit-content",
                }}
                value={titleValue}
                readOnly
              />
            </DeviceTitleWrapper>
          )}
          <TextArea
            autoSize
            style={{
              border: "none",
              resize: "none",
              padding: 0,
              borderRadius: 0,
              height: titleValue ? "60rem" : "64rem",
            }}
            value={value}
            readOnly
          />
          <TextAtom
            fontSize={"1.6rem"}
            color={color.caption}
            styles={css`
              position: absolute;
              bottom: 1rem;
              right: 1rem;
            `}
          >{`${bytes} / ${bytes > 90 ? "2,000" : "90"}bytes`}</TextAtom>
        </DeviceDisplayWrapper>
      </Wrapper>

      <DeviceBtn />
    </DeviceWrapper>
  );
};

export default DeviceTextarea;
