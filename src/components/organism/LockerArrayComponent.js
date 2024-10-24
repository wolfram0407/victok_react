import React from "react";
import styled, { css } from "styled-components";
import LockerBox from "../../pages/user/Main/components/organism/LockerBox";
import { color } from "../../styles/theme";
import BasicButton from "../atom/BasicButton";
import RowWrapper from "../atom/RowWrapper";
import TextAtom from "../atom/TextAtom";

const Wrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(10, max-content);
  overflow-x: auto;

  row-gap: 0;
`;

const LockerArrayComponent = ({
  data,
  onClickBox,
  onClickExtend,
  onClickTurnOn,
  onClickTurnOff,
  deleteMutation,
  lockerType,
  selectedLockerType,
  onSwitch,
}) => {
  return (
    <>
      <RowWrapper
        marginBottom={"0.4rem"}
        styles={
          data.length === 0 &&
          css`
            display: none;
          `
        }
      >
        <BasicButton
          onClick={() => onSwitch("prev")}
          disabled={
            lockerType.findIndex(
              (i) => i.locker_type === selectedLockerType?.locker_type
            ) === 0
          }
          styles={css`
            border: 0;
            padding: 0.5rem 1rem;
          `}
        >
          ◁
        </BasicButton>
        <TextAtom fontSize={"1.6rem"} color={color.mainBlue} fontWeight="bold">
          {selectedLockerType?.locker_type}
        </TextAtom>
        <BasicButton
          onClick={() => onSwitch("next")}
          disabled={
            lockerType.findIndex(
              (i) => i.locker_type === selectedLockerType?.locker_type
            ) ===
            lockerType.length - 1
          }
          styles={css`
            border: 0;
            padding: 0.5rem 1rem;
          `}
        >
          ▷
        </BasicButton>
      </RowWrapper>
      <Wrapper className="slideBar">
        {data.length > 0 ? (
          data.map((item, index) => (
            <LockerBox
              key={item.locker_type + item.locker_number}
              number={item.locker_number}
              isRunning={item.available === 1}
              isUser={item.name}
              name={item.name}
              idx={item.idx}
              caption={
                item.available === 1 && item.remain !== 0 && `(-${item.remain})`
              }
              currentExceptNumber={selectedLockerType.except_number
                ?.split(",")
                .map((v) => parseInt(v))}
              startedAt={item.start_date}
              expiredAt={item.end_date}
              onClickBox={() => onClickBox(item)}
              onClickExtend={() => onClickExtend(item)}
              onClickTurnOn={(callback) => onClickTurnOn(item, callback)}
              onClickTurnOff={(callback) => onClickTurnOff(item, callback)}
              deleteMutation={deleteMutation}
              isExcept={item.isExcept}
            />
          ))
        ) : (
          <TextAtom
            fontSize={"1.6rem"}
            fontWeight="bold"
            marginTop={"4.8rem"}
            marginBottom={"4.8rem"}
            styles={css`
              display: flex;
              width: 100%;
              justify-content: center;
            `}
          >
            데이터가 없습니다.
          </TextAtom>
        )}
      </Wrapper>
    </>
  );
};

export default LockerArrayComponent;
