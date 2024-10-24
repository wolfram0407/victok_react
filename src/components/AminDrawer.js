import {
  CreditCardOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SettingIcon } from "../assets/icons/icons";

import { color } from "../styles/theme";
import { useAppContext } from "../utils/context";

import DrawerTab from "./molecule/DrawerTab";

const Container = styled.div`
  width: 23rem;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${color.mainBlue};
  padding: 3rem 0;
  z-index: 999;
`;

const TopWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 13rem;
  height: 3.8rem;
  cursor: pointer;
  margin-bottom: 3rem;
`;

const BottomWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AminDrawer = () => {
  const { logUserOut } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const onClickLogo = () => {
    if (location.pathname === "/") {
      navigate(0);
    } else {
      navigate("/");
    }
  };

  const onClickLogout = () =>
    Modal.confirm({
      title: "알림",
      content: "로그아웃 하시겠습니까?",
      okText: "확인",
      onOk: () => logUserOut(),
      cancelText: "취소",
      onCancel: () => console.log("취소"),
    });

  const tabList = [
    {
      id: 1,
      icon: <UserOutlined style={{ fontSize: 15, color: color.white }} />,
      name: "고객 관리",
      sub: [
        { id: 1, name: "가맹점", path: "/" },
        { id: 2, name: "회원", path: "/member" },
      ],
    },
    {
      id: 2,
      icon: <HistoryOutlined style={{ fontSize: 15, color: color.white }} />,
      name: "내역 관리",
      sub: [
        { id: 1, name: "라카", path: "/locker" },
        { id: 2, name: "알림톡", path: "/alarmTalk" },
        { id: 3, name: "메시지", path: "/message" },
      ],
    },
    {
      id: 3,
      icon: <CreditCardOutlined style={{ fontSize: 15, color: color.white }} />,
      name: "수익 관리",
      sub: [
        { id: 1, name: "이용권", path: "/ticket" },
        { id: 2, name: "메시지", path: "/revenueMessage" },
      ],
    },
    {
      id: 4,
      icon: <SettingIcon />,
      name: "설정",
      sub: [
        { id: 1, name: "배너 관리", path: "/bannerSetting" },
        { id: 2, name: "링크 관리", path: "/linkSetting" },
        { id: 3, name: "비밀번호 재설정", path: "/changePassword" },
        { id: 4, name: "로그아웃", path: "/logout", onClick: onClickLogout },
      ],
    },
  ];

  return (
    <Container>
      <TopWrapper>
        <Logo
          src={require("../assets/images/logo.png")}
          alt="x"
          onClick={onClickLogo}
        />

        {tabList.slice(0, 3).map((item, index) => (
          <DrawerTab key={item.id} {...item} />
        ))}
      </TopWrapper>
      <BottomWrapper>
        {tabList.slice(3).map((item, index) => (
          <DrawerTab key={item.id} {...item} />
        ))}
      </BottomWrapper>
    </Container>
  );
};

export default AminDrawer;
