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
import revenueMessageTableColumn from "./components/column/revenueMessageTableColumn";
import InfoCard from "./components/organism/InfoCard";
import MessagePriceSettingModal from "./components/organism/MessagePriceSettingModal";

const RevenueMessage = () => {
  const [period, setPeriod] = useState({
    start: dayjs().set("year", dayjs().get("year") - 1),
    end: dayjs(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [revenueMessage, setRevenueMessage] = useState({
    data: [],
    total: 0,
    page: 1,
    sumData: {
      lms_charge: 0,
      lms_cnt: 0,
      mms_charge: 0,
      mms_cnt: 0,
      sms_charge: 0,
      sms_cnt: 0,
      total_charge: 0,
      total_cnt: 0,
    },
    totalData: {
      charge_sum: 0,
      lms_cnt: 0,
      message_cnt: 0,
      mms_cnt: 0,
      sms_cnt: 0,
      user_cnt: 0,
    },
  });
  const [sort, setSort] = useState({
    column: null,
    order: null,
  });

  const [messagePriceSettingModal, setMessagePriceSettingModal] =
    useState(false);

  const topTotalCount = {
    data: "initial",
    first_used: "initial",
    lms_charge: "initial",
    lms_cnt: "initial",
    mms_charge: "initial",
    mms_cnt: "initial",
    name: "initial",
    recent_used: "initial",
    sms_charge: "initial",
    sms_cnt: "initial",
    store_name: "initial",
    total_charge: "initial",
    total_cnt: "initial",
    user_idx: "initial",
    key: "initial",
  };

  const { refetch } = useQuery(
    "adminRevenueMessageList",
    async () =>
      await API.get("/admin/message-stats", {
        params: {
          start_date: period.start
            ? dayjs(period.start).format("YYYY-MM-DD")
            : undefined,
          end_date: period.end
            ? dayjs(period.end).format("YYYY-MM-DD")
            : undefined,
          keyword: searchTerm,
          page: revenueMessage.page,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total, sumData, totalData } = data;
        setRevenueMessage((prev) => ({
          ...prev,
          data: list.map((message) => ({ ...message, key: message.user_idx })),
          total,
          sumData,
          totalData,
        }));
      },
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setRevenueMessage((prev) => ({
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

  const infoList = [
    {
      id: 1,
      image: require("../../../assets/images/adminImage1.png"),
      title: "사용 금액",
      body: `${numberToLocaleString(
        revenueMessage.totalData.charge_sum ?? 0
      )} 원`,
      color: color.pupple,
    },
    {
      id: 2,
      image: require("../../../assets/images/adminImage5.png"),
      title: "사용 가맹점 수",
      body: `${numberToLocaleString(
        revenueMessage.totalData.user_cnt ?? 0
      )} 개`,
      color: color.green,
    },
    {
      id: 3,
      image: require("../../../assets/images/adminImage6.png"),
      title: "전송 건 수",
      multi: true,
      body: {
        message_cnt: revenueMessage.totalData.message_cnt,
        sms_cnt: revenueMessage.totalData.sms_cnt,
        lms_cnt: revenueMessage.totalData.lms_cnt,
        mms_cnt: revenueMessage.totalData.mms_cnt,
      },

      color: color.gold,
    },
  ];

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [searchTerm, revenueMessage.page, sort]);

  return (
    <LoggedInLayout>
      <RowWrapper marginBottom={"2.4rem"}>
        <TextAtom
          fontSize={"2.4rem"}
          fontWeight={"bold"}
          color={color.mainBlue}
          marginRight="2rem"
        >
          사용 현황
        </TextAtom>
        <BasicButton onClick={() => setMessagePriceSettingModal(true)}>
          메시지 금액 설정
        </BasicButton>
      </RowWrapper>
      <RowWrapper
        styles={css`
          gap: 1rem;
        `}
      >
        {infoList.map((item, index) => (
          <InfoCard
            width={index !== infoList.length - 1 ? "25%" : "50%"}
            key={item.id}
            {...item}
          />
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
        사용 내역
      </TextAtom>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
        marginBottom="2rem"
      >
        <RowWrapper>
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
              setRevenueMessage((prev) => ({ ...prev, page: 1 }));
              refetch();
            }}
          >
            검색
          </BasicButton>
        </RowWrapper>
        <RowWrapper>
          <ExcelButtonAdmin
            sheetColumn={[
              { header: "시설명", key: "store_name" },
              { header: "대표명", key: "name" },
              { header: "단문 건 수", key: "sms_cnt" },
              { header: "단문 금액", key: "sms_charge" },
              { header: "장문 건 수", key: "lms_cnt" },
              { header: "장문 금액", key: "lms_charge" },
              { header: "포토 건 수", key: "mms_cnt" },
              { header: "포토 금액", key: "mms_charge" },
              { header: "총 건 수", key: "total_cnt" },
              { header: "총 금액", key: "total_charge" },
              { header: "최초 사용일", key: "first_used" },
              { header: "최근 사용일", key: "recent_used" },
            ]}
            sheetName={"사용 내역"}
            getUrl={"/admin/message-stats-excel"}
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
            dataType={"message-stats"}
            customFormatter={(value, key) => {
              if (key === "first_used" || key === "recent_used") {
                return dayjs(value[key]).format("YYYY-MM-DD");
              } else {
                return value[key];
              }
            }}
          />
          <Input
            placeholder="시설명/대표명 빠른 검색"
            value={searchTerm}
            onChange={(e) => {
              setRevenueMessage((prev) => ({ ...prev, page: 1 }));
              setSearchTerm(e.target.value);
            }}
            style={{ width: "25rem" }}
          />
        </RowWrapper>
      </RowWrapper>
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="1rem">
        총{" "}
        <span style={{ color: color.gold }}>
          {numberToLocaleString(revenueMessage.total)}
        </span>{" "}
        건
      </TextAtom>
      <Table
        columns={revenueMessageTableColumn({
          sumData: revenueMessage.sumData,
        })}
        dataSource={[topTotalCount, ...revenueMessage.data]}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: revenueMessage.total,
          pageSize: 10,
          showSizeChanger: false,
          current: revenueMessage.page,
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
      <MessagePriceSettingModal
        open={messagePriceSettingModal}
        onCancel={() => setMessagePriceSettingModal(false)}
      />
    </LoggedInLayout>
  );
};

export default RevenueMessage;
