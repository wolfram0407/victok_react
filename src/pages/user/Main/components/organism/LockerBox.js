import { Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import styled, { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
// import LockerExtendModal from "./LockerExtendModal";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 12.4rem;
  height: 14rem;
  position: relative;
  border: 1px solid ${color.border};
  ${(p) =>
    p.isExcept
      ? css`
          background: repeating-linear-gradient(
            -45deg,
            ${color.white} 0 0.15px,
            ${color.grey} 0.15px 0.3px
          );
        `
      : css`
          background-color: ${(p) =>
            p.isUser ? color.skyBlue : p.running ? color.white : color.grey};
        `}
  padding: 1rem;
  letter-spacing: -0.1rem;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CustomButton = styled.div`
  flex: 1;
  font-size: 1.2rem;
  font-weight: 400;
  text-align: center;
  padding: 0.6rem;
  border: 0.1rem solid ${color.mainBlue};
  cursor: pointer;
  background-color: ${color.white};
  :hover {
    filter: brightness(1.2);
  }
  transition: all 0.3s ease;
  ${(p) =>
    p.left &&
    css`
      border-right: none;
      border-top-left-radius: 0.6rem;
      border-bottom-left-radius: 0.6rem;
    `}
  ${(p) =>
    p.right &&
    css`
      border-left: none;
      border-top-right-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
    `}
  ${(p) =>
    p.focused &&
    css`
      background-color: ${color.mainBlue};
      color: white;
    `}
`;

const TopButtonWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  gap: 0.2rem;
`;

const LockerBox = ({
  number,
  isRunning,
  isUser,
  name,
  idx,
  caption,
  startedAt,
  expiredAt,
  onClickBox: onClickBoxProp,
  onClickTurnOn,
  onClickTurnOff,
  onClickExtend,
  deleteMutation,
  currentExceptNumber = [],
  isExcept,
}) => {
  const [running, setRunning] = useState(isRunning);
  const excepted = !currentExceptNumber.includes(number);
  const onClickBox = (e) => {
    e.preventDefault();
    onClickBoxProp();
  };
  const onClickDelete = (e) => {
    Modal.confirm({
      title: "이용자 삭제",
      content: "선택하신 이용자를 삭제하시겠습니까?",
      okText: "삭제",
      onOk: () => deleteMutation.mutate({ idx }),
      cancelText: "취소",
    });
    e.stopPropagation();
  };

  return (
    <Box
      onClick={(e) => running && !isExcept && onClickBox(e)}
      isUser={isUser}
      running={excepted && running}
      isExcept={isExcept}
    >
      <Wrapper>
        <TextAtom fontSize={"1.6rem"} fontWeight="bold">
          {number}
        </TextAtom>
        {!isExcept && (
          <>
            <RowWrapper marginBottom={"0.6rem"}>
              <TextAtom
                fontSize={"1.4rem"}
                fontWeight={"bold"}
                marginRight="0.4rem"
                ellipsis
              >
                {name ? name : excepted && running ? "이용 가능" : "이용 불가"}
              </TextAtom>
              <TextAtom
                fontSize={"1.4rem"}
                color={color.caption}
                fontWeight={400}
              >
                {caption ?? ""}
              </TextAtom>
            </RowWrapper>
            {isUser && running && (
              <>
                <TextAtom fontSize={"1.2rem"} fontWeight={400}>
                  {startedAt
                    ? `시작: ${dayjs(startedAt).format(`YYYY-MM-DD`)}`
                    : ""}
                </TextAtom>
                <TextAtom fontSize={"1.2rem"} fontWeight={400}>
                  {expiredAt
                    ? `종료: ${dayjs(expiredAt).format(`YYYY-MM-DD`)}`
                    : ""}
                </TextAtom>
              </>
            )}
          </>
        )}
      </Wrapper>
      {!isExcept && (
        <>
          <RowWrapper>
            <CustomButton
              left
              focused={running}
              onClick={(e) => {
                e.stopPropagation();
                if (running) return;
                onClickTurnOn && onClickTurnOn(setRunning);
              }}
            >
              이용가능
            </CustomButton>
            <CustomButton
              right
              focused={!running}
              onClick={(e) => {
                e.stopPropagation();
                if (!running) return;
                onClickTurnOff && onClickTurnOff(setRunning);
              }}
            >
              수리중
            </CustomButton>
          </RowWrapper>
          {isUser && (
            <TopButtonWrapper>
              <BasicButton
                styles={css`
                  width: 3.4rem;
                  height: 2.2rem;
                  text-align: center;
                  line-height: 2.2rem;
                  padding: 0;
                  font-size: 1.1rem;
                  font-weight: 200;
                `}
                onClick={(e) => {
                  onClickExtend && onClickExtend();
                  e.stopPropagation();
                }}
              >
                연장
              </BasicButton>
              <BasicButton
                styles={css`
                  width: 3.4rem;
                  height: 2.2rem;
                  text-align: center;
                  line-height: 2.2rem;
                  padding: 0;
                  font-size: 1.1rem;
                  font-weight: 200;
                `}
                onClick={onClickDelete}
              >
                삭제
              </BasicButton>
            </TopButtonWrapper>
          )}
        </>
      )}
    </Box>
  );
};

export default LockerBox;
