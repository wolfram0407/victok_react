import { DatePicker, Divider, Empty, Input, Table } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import ExcelButtonAdmin from "../../../components/organism/ExcelButtonAdmin";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { numberToLocaleString } from "../../../utils/utils";
import ticketTableColumn from "./components/column/ticketTableColumn";
import InfoCard from "./components/organism/InfoCard";
import TicketCancelModal from "./components/organism/TicketCancelModal";
import TicketPriceSettingModal from "./components/organism/TicketPriceSettingModal";

const Ticket = () => {
  const [period, setPeriod] = useState({
    start: dayjs().set("year", dayjs().get("year") - 1),
    end: dayjs(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState({
    data: [],
    total: 0,
    sumData: {
      totalAmount: "0",
      totalRefund: "0",
      totalTalk: 0,
    },
    totalData: {
      totalAmount: "0",
      totalCount: 0,
      totalRefund: "0",
    },
    calculatedAmount: 0,
    page: 1,
  });
  const [sort, setSort] = useState({ column: null, order: null });
  const [targetId, setTargetId] = useState("");
  const [ticketPriceSettingModal, setTicketPriceSettingModal] = useState(false);
  const [ticketCancelModal, setTicketCancelModal] = useState(false);

  const topTotalCount = {
    storeType: "initial",
    storeName: "initial",
    userName: "initial",
    paid_time: "initial",
    data: "initial",
    paymentAmount: "initial",
    talkCount: "initial",
    refundAmount: "initial",
    refundMemo: "initial",
    paymentIdx: "initial",
    start_date: "initial",
    end_date: "initial",
    key: "initial",
  };

  const { refetch } = useQuery(
    "adminPaymentQuery",
    async () =>
      await API.get("/admin/payment", {
        params: {
          start_date: period.start
            ? dayjs(period.start).format("YYYY-MM-DD")
            : undefined,
          end_date: period.end
            ? dayjs(period.end).format("YYYY-MM-DD")
            : undefined,
          keyword: searchTerm,
          page: ticket.page,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { paymentList, sumData, total, totalData } = data;
        setTicket((prev) => ({
          ...prev,
          data: paymentList.map((payment) => ({
            ...payment,
            key: payment.paymentIdx,
          })),
          sumData,
          total,
          totalData,
          calculatedAmount:
            Number(totalData.totalAmount) - Number(totalData.totalRefund),
        }));
      },
    }
  );

  const infoList = [
    {
      id: 1,
      image: require("../../../assets/images/adminImage1.png"),
      title: "결제 금액",
      body: `${
        ticket.totalData
          ? numberToLocaleString(ticket.totalData.totalAmount)
          : 0
      } 원`,
      color: color.pupple,
    },
    {
      id: 2,
      image: require("../../../assets/images/adminImage2.png"),
      title: "결제 건 수",
      body: `${
        ticket.totalData ? numberToLocaleString(ticket.totalData.totalCount) : 0
      } 건`,
      color: color.green,
    },
    {
      id: 3,
      image: require("../../../assets/images/adminImage3.png"),
      title: "취소/환불 금액",
      body: `${
        ticket.totalData
          ? numberToLocaleString(ticket.totalData.totalRefund)
          : 0
      } 원`,
      color: color.gold,
    },
    {
      id: 4,
      image: require("../../../assets/images/adminImage4.png"),
      title: "정산 금액",
      body: `${
        ticket.calculatedAmount
          ? numberToLocaleString(ticket.calculatedAmount)
          : 0
      } 원`,
      color: color.mainBlue,
    },
  ];

  const onChange = useCallback((pagination, filters, extra) => {
    setTicket((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setSort({
        column: extra.field,
        order: extra.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setSort({ column: null, order: null });
    }
  }, []);

  const onClickCancel = (idx) => {
    setTargetId(idx);
    setTicketCancelModal(true);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [searchTerm, ticket.page, sort]);

  useEffect(() => {
    if (!period.start) {
      setPeriod((prev) => ({ ...prev, end: null }));
    }
  }, [period.start]);

  return (
    <LoggedInLayout>
      <RowWrapper marginBottom={"2.4rem"}>
        <TextAtom
          fontSize={"2.4rem"}
          fontWeight={"bold"}
          color={color.mainBlue}
          marginRight="2rem"
        >
          결제 현황
        </TextAtom>
        <BasicButton onClick={() => setTicketPriceSettingModal(true)}>
          이용권 정보 설정
        </BasicButton>
      </RowWrapper>
      <RowWrapper
        styles={css`
          gap: 1rem;
        `}
      >
        {infoList.map((item) => (
          <InfoCard width={"25%"} key={item.id} {...item} />
        ))}
      </RowWrapper>
      <Divider style={{ marginTop: "4.4rem", marginBottom: "3.4rem" }} />
      <TextAtom
        fontSize={"2.4rem"}
        fontWeight={"bold"}
        color={color.mainBlue}
        marginRight="2rem"
        marginBottom={"2.4rem"}
      >
        결제 내역
      </TextAtom>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
        marginBottom="2rem"
      >
        <RowWrapper>
          <TextAtom fontSize={"1.8rem"} fontWeight={500} marginRight="1rem">
            조회 기간
          </TextAtom>
          <DatePicker
            style={{ width: "14rem" }}
            format={"YYYY-MM-DD"}
            onChange={(e) =>
              setPeriod((prev) => ({
                ...prev,
                start: e,
              }))
            }
            value={period.start}
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
            format={"YYYY-MM-DD"}
            onChange={(e) =>
              setPeriod((prev) => ({
                ...prev,
                end: e,
              }))
            }
            value={period.end}
          />
          <BasicButton
            onClick={() => {
              setTicket((prev) => ({ ...prev, page: 1 }));
              refetch();
            }}
          >
            검색
          </BasicButton>
        </RowWrapper>
        <RowWrapper>
          <ExcelButtonAdmin
            sheetColumn={[
              { header: "시설명", key: "storeName" },
              { header: "대표명", key: "userName" },
              { header: "결제일", key: "paid_time" },
              { header: "이용기간", key: "start_date" },
              { header: "결제 금액", key: "paymentAmount" },
              { header: "알림톡 건 수", key: "talkCount" },
              { header: "취소/환불 금액	", key: "refundAmount" },
              { header: "취소/환불 내역", key: "refundMemo" },
            ]}
            sheetName={"결제 내역"}
            getUrl={"/admin/payment-excel"}
            formData={{
              start_date: period.start
                ? dayjs(period.start).format("YYYY-MM-DD")
                : undefined,
              end_date: period.end
                ? dayjs(period.end).format("YYYY-MM-DD")
                : undefined,
              keyword: searchTerm,
              ...(sort.column && { column: sort.column }),
              ...(sort.order && { order: sort.order }),
            }}
            dataType={"payment"}
            customFormatter={(value, key) => {
              if (key === "start_date") {
                console.log(value);
                return dayjs(value[key]).format("YYYY-MM-DD") +
                  "~" +
                  value["end_date"]
                  ? dayjs(value["end_date"]).format("YYYY-MM-DD")
                  : "";
              } else if (key === "paid_time") {
                return dayjs(value[key]).format("YYYY-MM-DD");
              } else if (key === "payWith") {
                return "카드";
              } else {
                return value[key];
              }
            }}
          />
          <Input
            placeholder="시설명/대표명 빠른 검색"
            value={searchTerm}
            onChange={(e) => {
              setTicket((prev) => ({ ...prev, page: 1 }));
              setSearchTerm(e.target.value);
            }}
            style={{ width: "25rem" }}
          />
        </RowWrapper>
      </RowWrapper>
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="1rem">
        총{" "}
        <span style={{ color: color.gold }}>
          {numberToLocaleString(ticket.total)}
        </span>{" "}
        건
      </TextAtom>
      <Table
        columns={ticketTableColumn({
          sumData: ticket.sumData,
          onClickManage: onClickCancel,
        })}
        dataSource={[topTotalCount, ...ticket.data]}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: ticket.total,
          pageSize: 11,
          showSizeChanger: false,
          current: ticket.page,
        }}
        showSorterTooltip={false}
        rowClassName={(record) =>
          record.data === "initial" ? "skyblue" : "white"
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
      <TicketPriceSettingModal
        open={ticketPriceSettingModal}
        onCancel={() => setTicketPriceSettingModal(false)}
      />
      <TicketCancelModal
        open={ticketCancelModal}
        onCancel={() => setTicketCancelModal(false)}
        targetId={targetId}
      />
    </LoggedInLayout>
  );
};

export default Ticket;
