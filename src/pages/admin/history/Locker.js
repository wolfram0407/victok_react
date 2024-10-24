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
import lockerTableColumn from "./column/lockerTableColumn";

const Locker = () => {
  const [period, setPeriod] = useState({
    start: dayjs().set("date", 1),
    end: dayjs(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [locker, setLocker] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [sort, setSort] = useState({ column: null, order: null });

  const convertColumn = (value) => {
    return value;
    // switch (value) {
    //   case "customer_name":
    //     return "customer.name";
    //   case "customer_phone":
    //     return "customer.phone";
    //   case "store_type":
    //     return "store.type";
    //   case "store_name":
    //     return "store.name";
    //   default:
    //     return `locker_log.${value}`;
    // }
  };

  const { refetch } = useQuery(
    "adminLockerHistoryQuery",
    async () =>
      await API.get("/admin/locker-log", {
        params: {
          ...(period.start && {
            start_date: dayjs(period.start).format("YYYY-MM-DD"),
          }),
          ...(period.end && {
            end_date: dayjs(period.end).format("YYYY-MM-DD"),
          }),
          ...(sort.column && { column: convertColumn(sort.column) }),
          ...(sort.order && { order: sort.order }),
          keyword: searchTerm,
          page: locker.page,
          amount: 10,
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total } = data;
        setLocker((prev) => ({
          ...prev,
          data: list.map((locker) => ({ ...locker, key: locker.idx })),
          total,
        }));
      },
      retry: false,
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setLocker((prev) => ({
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

  const resetPage = () => setLocker((prev) => ({ ...prev, page: 1 }));

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [searchTerm, sort, locker.page]);

  return (
    <LoggedInLayout>
      <TextAtom
        fontSize={"2.4rem"}
        fontWeight={"bold"}
        color={color.mainBlue}
        marginBottom="3.4rem"
      >
        라카 내역
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
            disabledDate={(current) => {
              if (period.start) {
                return current && current < dayjs(period.start).endOf("day");
              }
            }}
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
              { header: "처리 내용", key: "type" },
              { header: "처리일", key: "handled_time" },
              { header: "시설 유형", key: "store_type" },
              { header: "시설명", key: "store_name" },
              { header: "이름", key: "customer_name" },
              { header: "휴대폰번호", key: "customer_phone" },
              { header: "라카 구분", key: "locker_type" },
              { header: "라카 번호", key: "locker_number" },
              { header: "금액", key: "charge" },
              { header: "시작일", key: "start_date" },
              { header: "종료일", key: "end_date" },
            ]}
            sheetName={"라카 내역"}
            getUrl={"/admin/locker-log-excel"}
            formData={{
              ...(period.start && {
                start_date: dayjs(period.start).format("YYYY-MM-DD"),
              }),
              ...(period.end && {
                end_date: dayjs(period.end).format("YYYY-MM-DD"),
              }),
              ...(sort.column && { column: convertColumn(sort.column) }),
              ...(sort.order && { order: sort.order }),
              ...(searchTerm && { keyword: searchTerm }),
            }}
            dataType={"locker"}
            customFormatter={(value, key) => {
              if (
                key === "handled_time" ||
                key === "start_date" ||
                key === "end_date"
              ) {
                if (key === "handled_time") {
                  return dayjs(value[key]).format("YYYY-MM-DD HH:mm:ss");
                } else {
                  return dayjs(value[key]).format("YYYY-MM-DD");
                }
              } else {
                return value[key];
              }
            }}
          />
        </RowWrapper>
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
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="1rem">
        총{" "}
        <span style={{ color: color.gold }}>
          {locker.total ? numberToLocaleString(locker.total) : 0}
        </span>{" "}
        건
      </TextAtom>
      <Table
        columns={lockerTableColumn()}
        dataSource={locker.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: locker.total,
          pageSize: 10,
          showSizeChanger: false,
          current: locker.page,
        }}
        showSorterTooltip={false}
      />
    </LoggedInLayout>
  );
};

export default Locker;
