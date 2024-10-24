import { Checkbox } from "antd";
import { useState } from "react";
import { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import SimpleToggleHeader from "../atom/SimpleToggleHeader";

const MessageTypeSection = ({ sendType, messageType, setMessageType }) => {
  const [isMore, setIsMore] = useState(true);
  return (
    <>
      <SimpleToggleHeader
        title={"메시지 전송 형태"}
        isMore={isMore}
        toggleMore={() => setIsMore((prev) => !prev)}
      />
      {isMore && (
        <>
          <TextAtom fontSize={"1.4rem"} marginBottom="0.8rem">
            1. 전송 유형
          </TextAtom>
          <Checkbox
            checked={sendType === "message"}
            style={{ paddingLeft: "1.6rem", marginBottom: "1rem" }}
          >
            문자
          </Checkbox>
          <TextAtom fontSize={"1.4rem"} marginBottom="0.8rem">
            2. 메시지 유형
          </TextAtom>
          <RowWrapper paddingLeft={"1.6rem"} marginBottom="1rem">
            <Checkbox
              checked={messageType === "ad"}
              onChange={() => {
                if (messageType === "notice") {
                  setMessageType("ad");
                }
              }}
            >
              광고
            </Checkbox>
            <Checkbox
              checked={messageType === "notice"}
              onChange={() => {
                if (messageType === "ad") {
                  setMessageType("notice");
                }
              }}
            >
              단순 알림(공지)
            </Checkbox>
          </RowWrapper>
          <TextAtom
            styles={css`
              white-space: pre-wrap;
              padding-left: 1.6rem;
            `}
          >
            <span style={{ color: color.red, marginRight: "0.8rem" }}>※</span>
            {`광고성 내용이 포함되어 있는 경우 꼭 '광고'에 체크해주세요. 비용에는 차이가 없으나 전송 가능 시간이 08시~20시로 제한됩니다. 광고 메시지에 대한 보다 구체적인 안내는`}
            <span
              style={{
                color: color.mainBlue,
                textDecoration: "underLine",
                fontWeight: 600,
                marginLeft: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  "https://www.notion.so/victok/089a5cecf7f643a0941b17f5ff8acc24"
                )
              }
            >
              가이드 문서
            </span>
            {`를 통해 확인하실 수 있습니다.`}
            <div style={{ color: color.red, paddingLeft: "1.6rem" }}>
              정책 위반 시 책임은 고객사 측에 있으니 주의 바랍니다.
            </div>
          </TextAtom>
        </>
      )}
    </>
  );
};

export default MessageTypeSection;
