import React from "react";
import styled from "styled-components";
import { color } from "../../styles/theme";
import TextAtom from "../atom/TextAtom";

const Container = styled.div`
  padding-top: 15px;
`;

const BluedText = styled.span`
  color: ${color.mainBlue};
  font-weight: 600;
`;

const AdModalContent = () => {
  return (
    <Container>
      <TextAtom fontSize={"1.4rem"} marginBottom={".5rem"}>
        {`보다 확실한 라카 관리를 위해    
기본 제공되는 알림 외에`}
      </TextAtom>
      <TextAtom fontSize={"1.4rem"} marginBottom={".5rem"}>
        <BluedText>추가 알림</BluedText>을 설정해 보세요!
      </TextAtom>
      <TextAtom fontSize={"1.4rem"} marginBottom={".5rem"}>
        고객의 <BluedText>지공표 관리</BluedText>도 가능해요!
      </TextAtom>
    </Container>
  );
};

export default AdModalContent;
