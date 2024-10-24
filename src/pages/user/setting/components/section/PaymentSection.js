import { DatePicker, Empty, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import SettingSectionBox from "../atom/SettingSectionBox";
import holdingStatusTableColumn from "../column/holdingStatusTableColumn";
import paymentListTableColumn from "../column/paymentListTableColumn";

const tabList = [
  { id: 1, value: "paymentCurrent", body: "보유 현황" },
  { id: 2, value: "paymentHistory", body: "결제 내역" },
];

const PaymentSection = ({
  admin,
  onClickTopBtn,
  onClickUpgrade,
  onClickExtend,
  onClickManage,
  user_idx,
  setLastPaymentEndDate,
  setDisabledRange,
}) => {
  const [currentTab, setCurrentTab] = useState("paymentCurrent");
  const [period, setPeriod] = useState({
    start: null,
    end: null,
  });

  const [paymentCurrentInfo, setPaymentCurrentInfo] = useState({
    total: 0,
    list: [],
  });
  const [paymentHistories, setPaymentHistories] = useState([]);
  useQuery(
    "paymentCurrentList",
    async () => {
      return await API.get("/payment/payment-current-list", {
        params: { user_idx },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setPaymentCurrentInfo(data);
        if (data.list.length > 0) {
          setLastPaymentEndDate && setLastPaymentEndDate(data.list[0].end_date);
          setDisabledRange && setDisabledRange(data.range_list);
        }
      },
    }
  );

  const { refetch: paymentHistoryRefetch } = useQuery(
    "paymentHistories",
    async () => {
      return await API.get("/payment/payment-user", {
        params: {
          start_date: period.start ? dayjs(period.start).format("YYYY") : null,
          end_date: period.end ? dayjs(period.end).format("YYYY") : null,
          user_idx,
        },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setPaymentHistories(
          data.map((history, index) => ({ ...history, key: index + 1 }))
        );
      },
      onError: (error) => {
        console.log(error);
      },
      retry: false,
    }
  );

  const onClickTab = (value) => {
    if (currentTab === value) {
      return;
    }
    setCurrentTab(value);
  };

  useEffect(() => {
    if (!period.start && period.end) {
      setPeriod((prev) => ({ ...prev, end: null }));
    }
  }, [period]);

  return (
    <SettingSectionBox width={"100%"}>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        이용권 사용 내역
      </TextAtom>
      <RowWrapper
        marginBottom={"4rem"}
        styles={css`
          justify-content: ${admin ? "space-between" : "flex-start"};
        `}
      >
        {admin ? (
          <RowWrapper
            styles={css`
              gap: 0.6rem;
            `}
          >
            {tabList.map((item) => (
              <BasicButton
                key={item.id}
                focused={currentTab === item.value}
                onClick={() => onClickTab(item.value)}
              >
                {item.body}
              </BasicButton>
            ))}
          </RowWrapper>
        ) : (
          tabList.map((item, index) => (
            <BasicButton
              key={item.id}
              focused={currentTab === item.value}
              marginright={index !== tabList.length - 1 ? "0.6rem" : "1rem"}
              onClick={() => onClickTab(item.value)}
            >
              {item.body}
            </BasicButton>
          ))
        )}
        {!(admin && currentTab === "paymentHistory") && (
          <BasicButton
            styles={css`
              border-color: ${color.mainBlue};
              color: ${color.mainBlue};
            `}
            onClick={() => onClickTopBtn()}
          >
            {admin ? "+ 이용권 등록" : "상품 정보 보러 가기"}
          </BasicButton>
        )}
      </RowWrapper>
      {currentTab === "paymentCurrent" && (
        <>
          <TextAtom fontSize={"1.4rem"} marginBottom="1.4rem">
            총&nbsp;
            <span style={{ color: color.gold }}>
              {paymentCurrentInfo.total}
            </span>
            &nbsp;개
          </TextAtom>
          <Table
            columns={holdingStatusTableColumn({
              onClickExtend,
              onClickUpgrade,
              onClickManage,
              admin,
            })}
            dataSource={paymentCurrentInfo.list.map((ticket, index) => {
              return { ...ticket, key: index + 1 };
            })}
            style={{ borderTop: `2px solid ${color.mainBlue}` }}
            showSorterTooltip={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={"No Data"}
                />
              ),
            }}
          />
        </>
      )}
      {currentTab === "paymentHistory" && (
        <>
          <RowWrapper marginBottom={"2rem"}>
            <TextAtom fontSize={"1.4rem"} marginRight="1rem">
              조회 기간
            </TextAtom>
            <DatePicker
              style={{ width: "14rem" }}
              format={"YYYY"}
              onChange={(date) => {
                setPeriod((prev) => ({
                  ...prev,
                  start: date ? dayjs(date).startOf("year") : null,
                }));
              }}
              picker="year"
              value={period.start ?? null}
            />
            <TextAtom
              fontSize={"1.4rem"}
              fontWeight={600}
              marginLeft="0.6rem"
              marginRight="0.6rem"
            >
              ~
            </TextAtom>
            <DatePicker
              style={{ width: "14rem", marginRight: "1rem" }}
              format={"YYYY"}
              onChange={(date) => {
                setPeriod((prev) => ({
                  ...prev,
                  end: date ? dayjs(date).endOf("year") : null,
                }));
              }}
              picker="year"
              disabled={!period.start}
              value={period.end ?? null}
              disabledDate={(current) => period.start && period.start > current}
            />
            <BasicButton
              onClick={() => {
                paymentHistoryRefetch();
              }}
            >
              검색
            </BasicButton>
          </RowWrapper>
          <Table
            columns={paymentListTableColumn({ admin })}
            dataSource={paymentHistories}
            style={{ borderTop: `2px solid ${color.mainBlue}` }}
            showSorterTooltip={false}
            rowClassName={(record) =>
              record.refund_idx ||
              !(record.status === "이용중" || record.status === "이용예정")
                ? "grey"
                : "white"
            }
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={"No Data"}
                />
              ),
            }}
          />
        </>
      )}
    </SettingSectionBox>
  );
};

export default PaymentSection;
