import { Divider, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import styled, { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import AdModalContent from "../../../components/organism/AdModalContent";
import useMe from "../../../hooks/useMe";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import RowWrapper from "./../../../components/atom/RowWrapper";
import ChangePasswordSection from "./components/section/ChangePasswordSection";
import DrillerSection from "./components/section/DrillerSection";
import EditAccountSection from "./components/section/EditAccountSection";
import EditStoreSection from "./components/section/EditStoreSection";
import PaymentSection from "./components/section/PaymentSection";
import TagSection from "./components/section/TagSection";

const ContetnsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 50rem;
`;

const Banner = styled.img`
  width: 18rem;
  height: 100%;
  cursor: pointer;
`;

const btnList = [
  { id: 1, value: "editAccount", body: "개인 정보 수정" },
  { id: 2, value: "editStore", body: "시설 정보 수정" },
  { id: 3, value: "payment", body: "결제 정보" },
  { id: 4, value: "driller", body: "지공사 관리" },
  { id: 5, value: "tag", body: "태그 관리" },
  { id: 6, value: "changePassword", body: "비밀번호 재설정" },
];

const Setting = () => {
  const { adData, grade, adRefetch } = useOutletContext();
  const [ticketName, setTicketName] = useState("");

  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const navigate = useNavigate();

  const { data: meData, isLoading: meLoading } = useMe();

  const onClickTab = (value) => {
    if (currentTab === value) {
      return;
    }
    // TODO: 태그 관련 QA 끝나면 밑에걸로 해야함
    // if ((value === "driller" || value === "tag") && grade === 0) {
    if (value === "driller" && grade === 0) {
      return Modal.info({
        title: "유료 회원 전용 기능",
        content: <AdModalContent />,
        okText: "이용권 구매하기",
        onOk: () => {
          // navigate("/setting?tab=payment");
          navigate("/goodsInfo");
        },
        closable: true,
      });
    }
    navigate(`/setting?tab=${value}`);
  };

  const onClickShowGoods = () => navigate("/goodsInfo");
  const onClickUpgrade = () =>
    window.open("https://forms.gle/gmrctRg8sKE61jLj7");
  const onClickExtend = (value) => {
    if (
      dayjs(value)
        .subtract(1, "month")
        .diff(dayjs(new Date()).format("YYYY-MM-DD"), "day") > 0
    ) {
      Modal.error({
        title: "알림",
        content: "결제 가능일이 아닙니다.",
        okText: "확인",
      });
    } else {
      window.open("https://forms.gle/tticTMk5j5vjUE7t9");
    }
  };
  useQuery(
    "paymentSettingInfo",
    async () => await API.get("/admin/payment-setting").then((res) => res.data),
    {
      onSuccess: (data) => setTicketName(data.name),
      onError: (error) => console.log(error),
      staleTime: "Infinity",
      retry: false,
    }
  );

  useEffect(() => {
    adRefetch();
    // eslint-disable-next-line
  }, []);

  return (
    <LoggedInLayout>
      <RowWrapper>
        <WhiteBoxLayout
          styles={css`
            width: 90rem;
            margin-right: 2rem;
          `}
        >
          <RowWrapper marginBottom={"1.8rem"}>
            <TextAtom
              fontSize={"2.2rem"}
              fontWeight="bold"
              marginRight={"0.6rem"}
            >
              설정
            </TextAtom>
            <TextAtom fontSize={"2rem"} fontWeight={500} color={color.mainBlue}>
              {`(${grade === 1 ? ticketName : "무료"} 이용권 사용 중)`}
            </TextAtom>
          </RowWrapper>
          <RowWrapper
            styles={css`
              gap: 0.6rem;
            `}
          >
            {btnList.map((item, index) => (
              <BasicButton
                key={item.id}
                focused={currentTab === item.value}
                onClick={() => onClickTab(item.value)}
              >
                {item.body}
              </BasicButton>
            ))}
          </RowWrapper>
          <Divider />
          <ContetnsWrapper>
            {currentTab === "editAccount" && (
              <EditAccountSection meData={meData} />
            )}
            {currentTab === "editStore" && (
              <EditStoreSection meData={meData} meLoading={meLoading} />
            )}
            {currentTab === "payment" && (
              <PaymentSection
                onClickTopBtn={onClickShowGoods}
                onClickUpgrade={onClickUpgrade}
                onClickExtend={onClickExtend}
                ticketName={ticketName}
                // user_idx
              />
            )}
            {currentTab === "driller" && <DrillerSection />}
            {currentTab === "tag" && <TagSection />}
            {currentTab === "changePassword" && <ChangePasswordSection />}
          </ContetnsWrapper>
        </WhiteBoxLayout>
        {adData?.setting?.[1].show === 1 && adData?.setting?.[1].image && (
          <Banner
            src={adData.setting[1].image}
            alt={"banner"}
            onClick={() => window.open(adData?.setting?.[1].link)}
          />
        )}
      </RowWrapper>
    </LoggedInLayout>
  );
};

export default Setting;
