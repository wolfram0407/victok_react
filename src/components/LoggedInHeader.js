import { Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { color } from "../styles/theme";
import { useAppContext } from "../utils/context";

const Container = styled.div`
  width: 100%;
  min-width: 134.2rem;
  height: 8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${color.mainBlue};
  padding: 0 13%;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  overflow-x: hidden;
`;

const LeftWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  max-width: 70%;
`;

const Logo = styled.img`
  width: 15.4rem;
  height: 4.6rem;
  cursor: pointer;
  margin-right: 10rem;
`;

const Menu = styled.div`
  display: flex;
  padding: 0 4rem;
  height: 8rem;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 0.4rem solid ${color.mainBlue};
  cursor: pointer;
  &:hover {
    border-bottom: 0.4rem solid ${color.gold};
  }
  &:hover span {
    color: ${color.gold};
  }
`;

const MenuText = styled.span`
  font-size: 1.8rem;
  color: ${color.white};
  &:hover {
    color: ${color.gold};
  }
  transition: 0.3s ease;
`;

const RightWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const SubMenu = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1.6rem;
  font-size: 1.6rem;
  color: #fff;
  cursor: pointer;
  :hover {
    color: #d19a5c;
  }
  transition: color 0.3s ease;
`;

const Dot = styled.div`
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  /* margin: 0 1.6rem; */
  background-color: #fff;
`;

const LoggedInHeader = () => {
  const { logUserOut } = useAppContext();
  const navigate = useNavigate();
  const onClickMenu = (path) => navigate(path);
  const onClickLogout = () =>
    Modal.confirm({
      title: "알림",
      content: "로그아웃 하시겠습니까?",
      okText: "확인",
      onOk: () => logUserOut(),
      cancelText: "취소",
      onCancel: () => console.log("취소"),
    });
  const menuList = {
    main: [
      { id: 1, body: "라카 설정", path: "lockerSetting" },
      { id: 2, body: "라카 현황", path: "/" },
      { id: 3, body: "전체 회원", path: "member" },
      { id: 4, body: "메시지", path: "message" },
    ],
    sub: [
      { id: 1, body: "문의", path: "ask" },
      { id: 2, body: "설정", path: "my" },
      { id: 3, body: "로그아웃", onClick: onClickLogout },
    ],
  };
  return (
    <Container>
      <LeftWrapper>
        <Logo
          src={require("../assets/images/logo.png")}
          align-itemcenters
          alt="x"
          onClick={() => onClickMenu("/")}
        />
        {menuList.main.map((item) => (
          <Menu key={item.id} onClick={() => onClickMenu(item.path)}>
            <MenuText>{item.body}</MenuText>
          </Menu>
        ))}
      </LeftWrapper>
      <RightWrapper>
        {menuList.sub.map((item, index) => (
          <React.Fragment key={item.id}>
            <SubMenu
              onClick={() =>
                item.onClick ? item.onClick() : onClickMenu(item.path)
              }
              lastOne={index === menuList.sub.length - 1}
            >
              {item.body}
            </SubMenu>
            {index !== menuList.sub.length - 1 && <Dot />}
          </React.Fragment>
        ))}
      </RightWrapper>
    </Container>
  );
};

export default LoggedInHeader;
