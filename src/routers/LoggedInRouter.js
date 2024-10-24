import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import Main from "../pages/user/Main/Main";
import Member from "../pages/user/member/Member";
import LockerSetting from "../pages/user/lockerSetting/LockerSetting";
import { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useAppContext } from "../utils/context";
import MemberDetail from "../pages/user/member/MemberDetail";
import DrillingChartDetail from "../pages/user/member/DrillingChartDetail";

import MessageList from "../pages/user/messageList/MessageList";
import MessagePost from "../pages/user/messagePost/MessagePost";
import Inquiry from "../pages/user/inquiry/Inquiry";
import Setting from "../pages/user/setting/Setting";
import MemberDetailOutlet from "./MemberDetailOutlet";
import GoodsInfo from "../pages/user/setting/GoodsInfo";
import { useQuery } from "react-query";
import FranchiseDrawer from "../components/FranchiseDrawer";
import AminDrawer from "../components/AminDrawer";
import Store from "../pages/admin/store/Store";
import StoreDetail from "../pages/admin/store/StoreDetail";
import AdminMember from "../pages/admin/adminMember/AdminMember";
import Locker from "../pages/admin/history/Locker";
import AlarmTalk from "../pages/admin/history/AlarmTalk";
import Message from "../pages/admin/history/Message";
import Ticket from "../pages/admin/revenue/Ticket";
import RevenueMessage from "../pages/admin/revenue/RevenueMessage";
import BannerSetting from "../pages/admin/setting/BannerSetting";
import LinkSetting from "../pages/admin/setting/LinkSetting";
import ChangePassword from "../pages/admin/setting/ChangePassword";
import { Modal } from "antd";

const Container = styled.div`
  width: 100vw;
  min-height: 100%;
  display: flex;
`;

const RootView = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 23rem;
`;

const LoggedInOutlet = ({ grade, gradeRefetch, gradeLoading }) => {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;
  const { logUserOut } = useAppContext();

  const [adData, setAdData] = useState({
    locker: {
      1: { link: "", image: null, show: 0 },
      2: { link: "", image: null, show: 0 },
    },
    customer: {
      1: { link: "", image: null, show: 0 },
      2: { link: "", image: null, show: 0 },
    },
    setting: { 1: { link: "", image: null, show: 0 } },
  });
  // const [ddayArr, setDdayArr] = useState();

  const { refetch: adRefetch } = useQuery(
    "adData",
    async () => await API.get("/admin/banner").then((res) => res.data),
    {
      onSuccess: (data) => {
        let customData;
        const types = ["locker", "customer", "setting"];
        for (const type of types) {
          customData = {
            ...customData,
            [type]: { ...adData[type], ...data[type] },
          };
        }
        setAdData(data);
      },
      staleTime: "Infinity",
      retry: false,
    }
  );
  // console.log(token);
  // if (!token) {
  //   logUserOut();
  // }

  return (
    <Outlet
      context={{ token, adData, grade, gradeRefetch, adRefetch, gradeLoading }}
    />
  );
};

const LoggedInAdminOutlet = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes("storeDetail")) {
      if (!(location.pathname === "/")) {
        sessionStorage.removeItem("storeListSearchTerm");
        sessionStorage.removeItem("storeListPage");
      }
    }
    if (!location.pathname.includes("member")) {
      sessionStorage.removeItem("memberListSearchTerm");
      sessionStorage.removeItem("memberListPage");
    }
  }, [location]);

  return <Outlet />;
};

const LoggedInRouter = () => {
  const isAdmin =
    localStorage.getItem("isAdmin") ??
    sessionStorage.getItem("isAdmin") ??
    false;
  // const { isAdmin } = useAppContext();
  const [grade, setGrade] = useState(0);
  const { refetch: gradeRefetch, isLoading: gradeLoading } = useQuery(
    "gradeData",
    async () => {
      if (isAdmin) return;
      return await API.get("/user/grade").then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setGrade(data.grade);
        // setDdayArr(data.dday.dday.split(","));
      },
      onError: (error) => console.log(error),
      staleTime: "Infinity",
      retry: false,
    }
  );

  return (
    <Container>
      {isAdmin ? (
        <>
          <AminDrawer />
          <RootView>
            <Routes>
              <Route element={<LoggedInAdminOutlet />}>
                <Route path="/" element={<Store />} />
                <Route
                  path="/storeDetail/:store_idx/:user_idx"
                  element={<StoreDetail />}
                />

                <Route path="/member" element={<AdminMember />} />
                <Route element={<MemberDetailOutlet />}>
                  <Route path="/member/detail/:id" element={<MemberDetail />} />
                  <Route
                    path="/member/detail/:customer_idx/drillingChart/:idx"
                    element={<DrillingChartDetail />}
                  />
                </Route>
                <Route path="/locker" element={<Locker />} />
                <Route path="/alarmTalk" element={<AlarmTalk />} />
                <Route path="/message" element={<Message />} />
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/revenueMessage" element={<RevenueMessage />} />
                <Route path="/bannerSetting" element={<BannerSetting />} />
                <Route path="/linkSetting" element={<LinkSetting />} />
                <Route path="/changePassword" element={<ChangePassword />} />
              </Route>
            </Routes>
          </RootView>
        </>
      ) : (
        <>
          <FranchiseDrawer grade={grade} />
          <RootView>
            <Routes>
              <Route
                element={
                  <LoggedInOutlet
                    grade={grade}
                    gradeRefetch={gradeRefetch}
                    gradeLoading={gradeLoading}
                  />
                }
              >
                <Route path="/" element={<Main />} />
                <Route path="/lockerSetting" element={<LockerSetting />} />
                <Route path="/member" element={<Member />} />
                <Route
                  element={
                    <MemberDetailOutlet
                      grade={grade}
                      gradeRefetch={gradeRefetch}
                    />
                  }
                >
                  <Route path="/member/detail/:id" element={<MemberDetail />} />
                  <Route
                    path="/member/detail/:customer_idx/drillingChart/:idx"
                    element={<DrillingChartDetail />}
                  />
                </Route>
                <Route path="/messagePost" element={<MessagePost />} />
                <Route path="/messageList" element={<MessageList />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/goodsInfo" element={<GoodsInfo />} />
              </Route>
            </Routes>
          </RootView>
        </>
      )}
    </Container>
  );
};

export default LoggedInRouter;
