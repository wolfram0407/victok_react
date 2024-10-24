import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { color } from "../styles/theme";
import { DecoIcon } from "../assets/icons/icons";

const Container = styled.div`
  width: 100%;
  height: 8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${color.mainBlue};
  padding: 0 13%;
`;

const Logo = styled.img`
  width: 15.4rem;
  height: 4.6rem;
  cursor: pointer;
`;

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Tab = styled.div`
  font-size: 1.6rem;
  color: #fff;
  cursor: pointer;
  :hover {
    color: ${color.gold};
  }
  transition: color 0.3s ease;
`;

const Dot = styled.div`
  border-radius: 50%;
  margin: 0 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoggedOutHeader = () => {
  const navigate = useNavigate();
  const onClickTab = (path) => navigate(path);
  return (
    <Container>
      <Logo
        src={require("../assets/images/logo.png")}
        alt="x"
        onClick={() => onClickTab("/")}
      />
      <TabWrapper>
        <Tab onClick={() => onClickTab("login")}>로그인</Tab>
        <Dot>
          <DecoIcon />
        </Dot>
        <Tab onClick={() => onClickTab("register")}>회원가입</Tab>
      </TabWrapper>
    </Container>
  );
};

export default LoggedOutHeader;
