import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import { MdNoteAdd } from "react-icons/md";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import { Divider } from "antd";
import { useState } from "react";
import BasicInfoSection from "./components/section/BasicInfoSection";
import MemoModal from "./components/organism/MemoModal";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import BusinessInfoSection from "./components/section/BusinessInfoSection";
import StoreInfoSection from "./components/section/StoreInfoSection";
import PaymentSection from "../../user/setting/components/section/PaymentSection";
import TicketModal from "./components/organism/TicketModal";
import MessageSection from "./components/section/MessageSection";
import { useQuery } from "react-query";
import { API } from "../../../utils/api";
import { color } from "../../../styles/theme";
import TabList from "../../../components/organism/TabList";
import MemberSection from "./components/section/MemberSection";
import LockerSettingSection from "./components/section/LockerSettingSection";
import LockerListSection from "./components/section/LockerListSection";

const tabList = [
  { id: 1, value: "basicInfo", name: "기본정보" },
  { id: 2, value: "businessInfo", name: "사업자정보" },
  { id: 3, value: "storeInfo", name: "시설정보" },
  { id: 4, value: "payment", name: "결제내역" },
  { id: 5, value: "message", name: "메시지" },
  { id: 6, value: "member", name: "전체회원" },
  { id: 7, value: "lockerSetting", name: "라카구분" },
  { id: 8, value: "lockerList", name: "라카현황" },
];

const StoreDetail = () => {
  const idxs = useMatch("/storeDetail/:store_idx/:user_idx").params;
  const user_idx = idxs?.user_idx;
  const store_idx = idxs?.store_idx;

  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const [memoModal, setMemoModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  const [targetData, setTargetData] = useState(null);
  const [lastPaymentEndDate, setLastPaymentEndDate] = useState(null);

  const [userInfo, setUserInfo] = useState({
    agree_marketing: false,
    email: "",
    name: "",
    phone: "",
  });
  const [storeInfo, setStoreInfo] = useState({
    address1: "",
    address2: "",
    contact: "",
    name: "",
    type: "",
    zip_code: "",
    memo_cnt: 0,
  });
  const [businessInfo, setBusinessInfo] = useState({
    info: {
      business_number: "",
      ceo_name: "",
      ceo_phone: "",
      company_name: "",
      registration_images: "",
    },
    payment: {
      start_date: null,
      end_date: null,
    },
  });

  const [lockerType, setLockerType] = useState([]);
  const [selectedLockerType, setSelectedLockerType] = useState(null);
  const [disabledRange, setDisabledRange] = useState([]);

  useQuery(
    "adminUserInfo",
    async () =>
      await API.get("/admin/user-info", { params: { user_idx } }).then(
        (res) => res.data
      ),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { agree_marketing, email, name, phone } = data;
        setUserInfo({
          agree_marketing,
          email,
          name,
          phone,
        });
      },
      retry: false,
    }
  );

  useQuery(
    "adminStoreInfo",
    async () =>
      await API.get("/admin/store-info", { params: { store_idx } }).then(
        (res) => res.data
      ),
    {
      onSuccess: (data) => {
        if (!data) return;

        const {
          address1,
          address2,
          contact,
          name,
          type,
          zip_code,
          idx,
          memo_cnt,
        } = data;
        setStoreInfo({
          address1,
          address2,
          contact,
          name,
          type,
          zip_code,
          idx,
          memo_cnt,
        });
      },
    }
  );

  useQuery(
    "adminBusinessInfo",
    async () =>
      await API.get("/admin/business-info", { params: { user_idx } }).then(
        (res) => res.data
      ),
    {
      onSuccess: (data) => {
        if (!data) return;
        setBusinessInfo(data);
      },
    }
  );

  useQuery(
    "adminGetStoreLockerInfo",
    async () =>
      await API.post("/admin/locker-type-all", { user_idx }).then(
        (res) => res.data
      ),
    {
      onSuccess: (data) => {
        if (!data) return;
        setLockerType(data.chargeList);
        if (!selectedLockerType) {
          if (data.chargeList.length > 0) {
            setSelectedLockerType(data.chargeList[0]);
          }
        }
      },
    }
  );

  const navigate = useNavigate();

  const onClickTab = (value) => {
    if (currentTab === value) {
      return;
    }
    navigate(`/storeDetail/${store_idx}/${user_idx}?tab=${value}`);
  };

  const onClickManage = (data, range) => {
    setTargetData(data);
    setTicketModal(true);
  };

  return (
    <LoggedInLayout>
      <RowWrapper marginBottom={"2rem"}>
        <TextAtom
          fontSize={"2.4rem"}
          fontWeight="bold"
          marginRight={"1rem"}
          color={color.mainBlue}
        >
          {storeInfo.name}
        </TextAtom>
        <MdNoteAdd
          size={"2.4rem"}
          color={storeInfo.memo_cnt === 0 ? color.grey : color.mainBlue}
          style={{ cursor: "pointer " }}
          onClick={() => setMemoModal(true)}
        />
      </RowWrapper>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
      >
        <TabList
          list={tabList.slice(0, 5)}
          onChange={onClickTab}
          currentTab={currentTab}
          borderRadius={"0.2rem"}
          gap="1rem"
          marginBottom={"0"}
        />

        <RowWrapper
          styles={css`
            gap: 1rem;
          `}
        >
          <TabList
            list={tabList.slice(5)}
            onChange={onClickTab}
            currentTab={currentTab}
            borderRadius={"0.2rem"}
            gap="1rem"
            marginBottom={"0"}
          />
          <BasicButton
            onClick={() => navigate("/")}
            styles={css`
              border-radius: "0.2rem";
            `}
          >
            목록
          </BasicButton>
        </RowWrapper>
      </RowWrapper>
      <Divider />
      {currentTab === "basicInfo" && (
        <BasicInfoSection userInfo={userInfo} user_idx={user_idx} />
      )}
      {currentTab === "businessInfo" && (
        <BusinessInfoSection businessInfo={businessInfo} user_idx={user_idx} />
      )}
      {currentTab === "storeInfo" && <StoreInfoSection storeInfo={storeInfo} />}
      {currentTab === "payment" && (
        <PaymentSection
          admin
          onClickTopBtn={() => setTicketModal(true)}
          onClickManage={onClickManage}
          setLastPaymentEndDate={setLastPaymentEndDate}
          user_idx={user_idx}
          setDisabledRange={setDisabledRange}
        />
      )}
      {currentTab === "message" && <MessageSection user_idx={user_idx} />}
      {currentTab === "member" && <MemberSection user_idx={user_idx} />}
      {currentTab === "lockerSetting" && (
        <LockerSettingSection user_idx={user_idx} />
      )}
      {currentTab === "lockerList" && (
        <LockerListSection
          user_idx={user_idx}
          lockerType={lockerType}
          selectedLockerType={selectedLockerType}
          setSelectedLockerType={setSelectedLockerType}
        />
      )}

      <MemoModal
        open={memoModal}
        onCancel={() => setMemoModal(false)}
        selectedUserIdx={user_idx}
      />
      <TicketModal
        open={ticketModal}
        onCancel={() => {
          setTicketModal(false);
          setTargetData(null);
        }}
        targetData={targetData}
        user_idx={user_idx}
        lastPaymentEndDate={lastPaymentEndDate}
        disabledRange={disabledRange}
      />
    </LoggedInLayout>
  );
};

export default StoreDetail;
