import { DatePicker, Input, Table } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
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
import alarmTalkTableColumn from "./column/alarmTalkTableColumn";

const AlarmTalk = () => {
  const [period, setPeriod] = useState({
    start: dayjs().set("date", 1),
    end: dayjs(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [alarmTalk, setAlarmTalk] = useState({
    data: [],
    total: 0,
    page: 1,
    amount: 10,
  });
  const [sort, setSort] = useState({
    column: null,
    order: null,
  });

  const { refetch } = useQuery(
    "adminAlarmTalkQuery",
    async () =>
      await API.get("/admin/talk-log", {
        params: {
          page: alarmTalk.page,
          ...(searchTerm && { keyword: searchTerm }),
          ...(period.start && {
            start_date: dayjs(period.start).format("YYYY-MM-DD"),
          }),
          ...(period.end && {
            end_date: dayjs(period.end).format("YYYY-MM-DD"),
          }),
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total } = data;
        setAlarmTalk((prev) => ({
          ...prev,
          data: list.map((log) => ({ ...log, key: log.idx })),
          total,
        }));
      },
      retry: false,
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setAlarmTalk((prev) => ({
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

  const resetPage = () => setAlarmTalk((prev) => ({ ...prev, page: 1 }));

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [alarmTalk.page, alarmTalk.amount, searchTerm, sort]);

  return (
    <LoggedInLayout>
      <TextAtom
        fontSize={"2.4rem"}
        fontWeight={"bold"}
        color={color.mainBlue}
        marginBottom="3.4rem"
      >
        알림톡 내역
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
            onChange={(e) => setPeriod((prev) => ({ ...prev, start: e }))}
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
            onChange={(e) => setPeriod((prev) => ({ ...prev, end: e }))}
            value={period.end}
          />
          <BasicButton
            marginright={"1rem"}
            onClick={() => {
              resetPage();
              refetch();
            }}
          >
            검색
          </BasicButton>
          <ExcelButtonAdmin
            sheetColumn={[
              { header: "구분", key: "type" },
              { header: "시설명", key: "store_name" },
              { header: "고객명", key: "customer_name" },
              { header: "휴대폰번호", key: "customer_phone" },
              { header: "발송일", key: "created_time" },
            ]}
            sheetName={"알림톡 내역"}
            getUrl={"/admin/talk-log-excel"}
            formData={{
              ...(searchTerm && { keyword: searchTerm }),
              ...(period.start && {
                start_date: dayjs(period.start).format("YYYY-MM-DD"),
              }),
              ...(period.end && {
                end_date: dayjs(period.end).format("YYYY-MM-DD"),
              }),
              ...(sort.column && { column: sort.column }),
              ...(sort.order && { order: sort.order }),
            }}
            dataType={"alarm-talk"}
            customFormatter={(value, key) => {
              if (key === "created_time") {
                return dayjs(value[key]).format("YYYY-MM-DD");
              } else {
                return value[key];
              }
            }}
          />
        </RowWrapper>
        <RowWrapper>
          <Input
            placeholder="이름/연락처/시설명 빠른 검색"
            value={searchTerm}
            onChange={(e) => {
              resetPage();
              setSearchTerm(e.target.value);
            }}
            style={{ width: "25rem" }}
          />
        </RowWrapper>
      </RowWrapper>
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="1rem">
        총{" "}
        <span style={{ color: color.gold }}>
          {alarmTalk.total ? numberToLocaleString(alarmTalk.total) : 0}
        </span>{" "}
        건
      </TextAtom>
      <Table
        columns={alarmTalkTableColumn()}
        dataSource={alarmTalk.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: alarmTalk.total,
          pageSize: 10,
          showSizeChanger: false,
          current: alarmTalk.page,
        }}
        showSorterTooltip={false}
      />
    </LoggedInLayout>
  );
};

export default AlarmTalk;
