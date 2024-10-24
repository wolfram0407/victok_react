import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  ChatIcon,
  DecoIcon,
  LockIcon,
  SettingIcon,
} from "../assets/icons/icons";
import useMe from "../hooks/useMe";
import { color } from "../styles/theme";
import { useAppContext } from "../utils/context";
import BasicButton from "./atom/BasicButton";
import TextAtom from "./atom/TextAtom";
import DrawerSubTab from "./molecule/DrawerSubTab";
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

const LoggedInInfoWrapper = styled.div`
  width: 12.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.6rem;
`;

const DecoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BottomWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FranchiseDrawer = ({ grade }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logUserOut } = useAppContext();
  const { data: meData, isLoading } = useMe();

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
      icon: <LockIcon />,
      name: "라카",
      sub: [
        { id: 1, name: "라카 현황", path: "/" },
        { id: 2, name: "라카 설정", path: "/LockerSetting" },
      ],
    },
    {
      id: 2,
      icon: <UserOutlined style={{ fontSize: 15, color: color.white }} />,
      name: "회원",
      sub: [{ id: 1, name: "회원", path: "/member" }],
    },
    {
      id: 3,
      icon: <UserOutlined style={{ fontSize: 15, color: color.white }} />,
      name: "메시지",
      sub: [
        {
          id: 1,
          name: "메시지 전송",
          path: "/messagePost",
          onClick:
            grade === 0
              ? () =>
                  Modal.confirm({
                    title: "메시지 전송 불가",
                    content:
                      "메시지 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
                    okText: "구매하기",
                    onOk: () => navigate("/goodsInfo"),
                    cancelText: "취소",
                  })
              : null,
        },
        {
          id: 2,
          name: "메시지 내역",
          path: "/messageList",
          onClick:
            grade === 0
              ? () =>
                  Modal.confirm({
                    title: "메시지 내역 확인 불가",
                    content:
                      "메시지 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
                    okText: "구매하기",
                    onOk: () => navigate("/goodsInfo"),
                    cancelText: "취소",
                  })
              : null,
        },
      ],
    },
    {
      id: 4,
      icon: <ChatIcon isCurrentPage={location.pathname.includes("/inquiry")} />,
      name: "문의",
      path: "/inquiry",
    },
    {
      id: 5,
      icon: (
        <SettingIcon isCurrentPage={location.pathname.includes("/setting")} />
      ),
      name: "설정",
      path: "/setting?tab=editAccount",
    },
  ];

  return (
    <Container>
      <TopWrapper>
        <Logo
          src={require("../assets/images/logo.png")}
          alt="x"
          onClick={() => navigate("/")}
        />
        <LoggedInInfoWrapper>
          <DecoWrapper style={{ marginBottom: "2rem" }}>
            {[...Array(16)].map((item, index) => (
              <DecoIcon key={index} />
            ))}
          </DecoWrapper>
          <TextAtom
            fontSize={"1.6rem"}
            fontWeight="bold"
            color={color.white}
            marginBottom="1.6rem"
          >
            {isLoading ? <LoadingOutlined /> : meData.store_name}
          </TextAtom>
          <BasicButton
            styles={css`
              width: 100%;
              height: 3rem;
              font-size: 1.4rem;
              font-weight: 600;
              text-align: center;
              border-radius: 0.6rem;
              border-color: none;
              background-color: ${color.white};
            `}
            marginbottom="2rem"
            onClick={onClickLogout}
          >
            로그아웃
          </BasicButton>
          <DecoWrapper>
            {[...Array(16)].map((item, index) => (
              <DecoIcon key={index} />
            ))}
          </DecoWrapper>
        </LoggedInInfoWrapper>
        {tabList.slice(0, 3).map((item, index) => (
          <DrawerTab key={item.id} {...item} />
        ))}
      </TopWrapper>
      <BottomWrapper>
        {tabList.slice(3).map((item, index) => (
          <DrawerSubTab key={item.id} {...item} />
        ))}
      </BottomWrapper>
    </Container>
  );
};

export default FranchiseDrawer;
