import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bg from "../assets/images/bg.jpg";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  aspect-ratio: 20 / 9;
  background-image: url(${bg});
  background-size: cover;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15%;
`;

const Title = styled.div`
  font-size: 6rem;
  color: #fff;
  white-space: pre-wrap;
  line-height: 1.4;
  letter-spacing: -0.4rem;
  margin-bottom: 2rem;
  margin-left: -1rem;
`;

const Payload = styled.div`
  font-size: 2.4rem;
  color: #fff;
  white-space: pre-wrap;
  line-height: 1.5715;
  margin-bottom: 5rem;
`;

const Button = styled.div`
  width: 29rem;
  height: 7rem;
  border-radius: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #142850;
  background-color: #fff;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
`;

const Welecome = () => {
  const navigate = useNavigate();
  const onClickStart = () => navigate("login");
  return (
    <Container>
      <ContentsWrapper>
        <Title>{`라카 관리의 시작은
빅톡에서!`}</Title>
        <Payload>
          {`이용자 라카 사용 기간에 따라 자동으로 알림톡을 보내드립니다.
번거로운 일은 저희에게 맡기세요.`}
        </Payload>
        <Button onClick={onClickStart}>지금 바로 시작하기</Button>
      </ContentsWrapper>
    </Container>
  );
};

export default Welecome;
