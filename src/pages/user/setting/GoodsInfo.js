import { Modal } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { numberToLocaleString } from "../../../utils/utils";
import GoodsInfoBox from "./components/organism/GoodsInfoBox";

const freeList = [
  { id: 1, body: "라카관리 프로그램" },
  { id: 2, body: "이용자 무제한 추가" },
  { id: 3, body: "3일 전 자동 알림톡 전송" },
];
const basicList = [
  { id: 1, body: "무료버전 기능 + 알림톡 주기 최대 5개 선택 가능" },
  { id: 2, body: "특정고객 맞춤 메시지 전송" },
  { id: 3, body: "라카내역 엑셀 다운로드 가능" },
  { id: 4, body: "지공차트 관리 프로그램" },
];

const GoodsInfo = () => {
  const navigate = useNavigate();
  const { grade } = useOutletContext();
  const [product, setProduct] = useState({
    name: "",
    amount: 0,
  });

  useQuery(
    "paymentSettingInfo",
    async () => await API.get("/admin/payment-setting").then((res) => res.data),
    {
      onSuccess: (data) =>
        setProduct({
          name: data.name,
          amount: data.amount,
        }),
      staleTime: "Infinity",
      retry: false,
    }
  );

  return (
    <LoggedInLayout>
      <WhiteBoxLayout
        padding={"5rem 8rem"}
        styles={css`
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
        `}
      >
        <TextAtom fontSize={"3rem"} fontWeight={"bold"} marginBottom="0.6rem">
          나에게 맞는 서비스를 선택해 이용해 보세요.
        </TextAtom>
        <TextAtom fontSize={"3rem"} marginBottom="5rem">
          고객도 나도 편리한, 슬기로운 볼링장을 응원합니다!
        </TextAtom>
        <RowWrapper
          marginBottom={"5rem"}
          styles={css`
            justify-content: center;
            width: 100%;
            gap: 4rem;
          `}
        >
          <GoodsInfoBox
            type={"free"}
            title={"무료"}
            price={0}
            payload={`라카이용 만료 3일 전에\n알림톡으로 알려드립니다.`}
            btnTitle={"무료버전 이용하기"}
            list={freeList}
            onClick={() => {
              grade === 0
                ? navigate("/")
                : Modal.info({
                    title: "알림",
                    content: "유료 버전을 이용 중인 회원입니다.",
                    okText: "확인",
                  });
            }}
          />
          <GoodsInfoBox
            type={"basic"}
            title={product.name}
            priceComponent={
              <RowWrapper marginBottom={"2rem"}>
                <TextAtom
                  fontSize={"2.2rem"}
                  fontWeight={600}
                  marginRight="0.4rem"
                >
                  {`${numberToLocaleString(product.amount)}원 / 1년`}
                </TextAtom>
                <TextAtom fontSize={"1.2rem"} color={color.caption}>
                  {`(월 ${numberToLocaleString(
                    Math.floor(product.amount / 12 / 100) * 100
                  )}원)`}
                </TextAtom>
              </RowWrapper>
            }
            payload={`다양한 기간에 알림톡으로\n안내가 가능합니다.`}
            btnTitle={"이용권 구매하기"}
            list={basicList}
            onClick={() => {
              grade === 0
                ? Modal.info({
                    title: "알림",
                    content: "이용권을 구매하시겠습니까?",
                    okText: "결제하기",
                    closable: true,
                    onOk: () =>
                      window.open("https://forms.gle/gmrctRg8sKE61jLj7"),
                    // onOk: () => {
                    //   navigate("/ticketPayment/0");
                    // },
                  })
                : Modal.info({
                    title: "알림",
                    content: "이미 이용권을 보유하고 있습니다.",
                    okText: "확인",
                  });
            }}
          />
        </RowWrapper>
        <BasicButton
          styles={css`
            width: 40rem;
            min-height: 4.8rem;
            font-weight: 500;
          `}
          marginbottom="1.6rem"
          onClick={() => navigate(-1)}
        >
          돌아가기
        </BasicButton>
        <TextAtom fontSize={"1.3rem"} color={color.caption}>
          판매 서비스 책임자: (주)골드레인 대표 김도현 / 연락처: 033-818-0337
        </TextAtom>
      </WhiteBoxLayout>
    </LoggedInLayout>
  );
};

export default GoodsInfo;
