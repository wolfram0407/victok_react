import React from "react";
import styled from "styled-components";
import img_join from "../../../assets/images/ico_join.png";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { color } from "../../../styles/theme";

// 회원가입 완료

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Image = styled.img`
  padding: 1rem;
`;

const Title = styled.div`
  font-size: 4rem;
`;

const SubTitle = styled.div`
  font-size: 1.8rem;
  font-weight: 200;
  color: ${color.caption};
`;

const Complete = ({ currentStep }) => {
  const navigate = useNavigate();

  return (
    <Container style={{ display: currentStep ? "flex" : "none" }}>
      <Wrap style={{ marginBottom: 40 }}>
        <Title style={{ fontWeight: 500, color: color.black }}>
          회원가입이
          <br />
          완료<span style={{ fontWeight: 100 }}>되었습니다.</span>
          <SubTitle>이제 편리하게 관리해 보세요.</SubTitle>
        </Title>
        <Image src={img_join} />
      </Wrap>
      <Button
        type="primary"
        block
        onClick={() => navigate("/login")}
        style={{
          height: 48,
          fontSize: 16,
          borderRadius: 4,
          background: color.mainBlue,
        }}
      >
        로그인 하기
      </Button>
    </Container>
  );
};

export default Complete;
