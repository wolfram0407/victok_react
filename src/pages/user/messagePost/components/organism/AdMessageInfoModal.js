import { Divider, Modal } from "antd";
import styled, { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import DeviceLayout from "../../../../../components/layouts/DeviceLayout";
import { color } from "../../../../../styles/theme";

const Container = styled.div`
  width: 100%;
  padding: 0 1.2rem;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.6rem;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;

const O = styled.span`
  color: ${color.blue};
`;
const X = styled.span`
  color: ${color.red};
`;

const AdMessageInfoModal = ({ open, onCancel }) => {
  return (
    <Modal
      forceRender
      open={open}
      onCancel={onCancel}
      title={`광고메시지 전송 가이드`}
      footer={[]}
      style={{ minWidth: "60rem" }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: 0 }} />
      <Container>
        <TextAtom
          fontSize={"1.4rem"}
          styles={css`
            font-weight: 600;
            > span {
              color: ${color.red};
            }
          `}
          marginBottom="1.8rem"
        >
          광고메시지를 전송할 경우 <span>반드시 다음의 내용</span>이 포함되어야
          합니다.
        </TextAtom>
        <RowWrapper>
          <DeviceLayout>
            <TextAtom fontSize={"1.4rem"}>①(광고) + ②발송자정보</TextAtom>
            <TextAtom fontSize={"1.4rem"} color={color.grey}>
              문자내용
            </TextAtom>
            <TextAtom fontSize={"1.4rem"}>③무료거부 080번호</TextAtom>
          </DeviceLayout>

          <RightSection>
            <TextAtom fontSize={"1.4rem"} marginBottom="0.2rem">
              ① 광고임을 표시
            </TextAtom>
            <Wrapper marginBottom="2rem">
              <TextAtom fontSize={"1.4rem"} color={color.darkGrey}>
                {`[광고], <광고>, 광고 및 기타 특수기호 사용 `}
                <X>X</X>
              </TextAtom>
            </Wrapper>
            <TextAtom fontSize={"1.4rem"} marginBottom="0.2rem">
              ② 발송자 정보 표시
            </TextAtom>
            <Wrapper marginBottom="2rem">
              <TextAtom fontSize={"1.4rem"}>
                👉 회사명, 브랜드명, 서비스명 등 입력
              </TextAtom>
              <Wrapper marginBottom="0.2rem">
                <TextAtom fontSize={"1.4rem"} marginBottom="0.2rem">
                  개인의 경우도 예외 없음
                </TextAtom>
                <TextAtom fontSize={"1.2rem"} color={color.darkGrey}>
                  - 홍길동 <X>X</X>
                </TextAtom>
                <TextAtom fontSize={"1.2rem"} color={color.darkGrey}>
                  - 빅톡볼링장 홍길동 <O>O</O>
                </TextAtom>
              </Wrapper>
              <TextAtom fontSize={"1.4rem"} marginBottom="0.2rem">
                👉 (광고) 뒤에 발송자 정보 바로 표시
              </TextAtom>
              <Wrapper marginBottom="0.2rem">
                <TextAtom fontSize={"1.2rem"} color={color.darkGrey}>
                  - (광고)안녕하세요{" "}
                  <span style={{ textDecoration: "underLine" }}>
                    빅톡볼링장
                  </span>
                  입니다. <X>X</X>
                </TextAtom>
                <TextAtom fontSize={"1.2rem"} color={color.darkGrey}>
                  - (광고)
                  <span style={{ textDecoration: "underLine" }}>
                    빅톡볼링장
                  </span>{" "}
                  안녕하세요 <O>O</O>
                </TextAtom>
              </Wrapper>
            </Wrapper>
            <TextAtom fontSize={"1.4rem"} marginBottom="0.2rem">
              ③ 최하단에 무료거부 080 번호 표시
            </TextAtom>
            <Wrapper>
              <TextAtom fontSize={"1.4rem"} color={color.darkGrey}>
                - 무료거부, 무료수신거부 <O>O</O>
              </TextAtom>
              <TextAtom fontSize={"1.4rem"} color={color.darkGrey}>
                - 수신거부, 거부 <X>X</X>
              </TextAtom>
            </Wrapper>
          </RightSection>
        </RowWrapper>
      </Container>
      <Divider />
      <TextAtom
        fontSize={"1.2rem"}
        styles={css`
          white-space: pre-wrap;
        `}
      >
        {`매장 또는 웹사이트 등 업체의 방문을 유도하는 모든 문자를 광고문자라고 합니다.
광고 표기 미준수 시 수신자에게 전달되지 않고 발송 실패 됩니다.
가이드 미준수로 발송 실패 및 제한되는 피해가 발생하지 않도록
빅톡이 자체적으로 가이드를 준수하고 있으니 편하게 이용하시면 됩니다.`}
      </TextAtom>
      <Divider style={{ marginBottom: 0 }} />
    </Modal>
  );
};

export default AdMessageInfoModal;
