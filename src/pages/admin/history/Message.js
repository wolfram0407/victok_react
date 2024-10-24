import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import MessageTable from "../../user/messageList/components/organism/MessageTable";

const Message = () => {
  const [period, setPeriod] = useState({
    start: dayjs().set("date", 1),
    end: dayjs(),
  });
  const [messageType, setMessageType] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({
    data: [],
    total: 0,
    totalFee: 0,
    page: 1,
  });
  const [sort, setSort] = useState({
    column: null,
    order: null,
  });

  const { refetch } = useQuery(
    "adminMessageList",
    async () =>
      await API.get("/admin/message-log", {
        params: {
          ...(period.start && {
            start_date: dayjs(period.start).format("YYYY-MM-DD"),
          }),
          ...(period.end && {
            end_date: dayjs(period.end).format("YYYY-MM-DD"),
          }),
          ...(messageType && messageType !== "ALL" && { type: messageType }),
          ...(category &&
            category !== "all" && {
              is_ad: Number(Boolean(category === "ad")),
            }),
          ...(searchTerm && { keyword: searchTerm }),
          page: message.page,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { list, total, totalFee } = data;
        setMessage((prev) => ({
          ...prev,
          data: list.map((message) => ({ ...message, key: message.idx })),
          total,
          totalFee,
        }));
      },
    }
  );

  const onChange = useCallback((pagination, filters, extra) => {
    setMessage((prev) => ({
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

  const resetPage = () => setMessage((prev) => ({ ...prev, page: 1 }));

  const excelExportProps = {
    sheetColumn: [
      { header: "시설명", key: "store_name" },
      { header: "전송 일시", key: "created_time" },
      { header: "전송 유형", key: "is_ad" },
      { header: "메시지 타입", key: "type" },
      { header: "전송 시점", key: "is_reserve" },
      { header: "전송 건 수", key: "cnt" },
      { header: "전송 내용", key: "msg" },
      { header: "성공 건 수", key: "success_cnt" },
      { header: "사용 금액", key: "charge" },
    ],
    sheetName: "메시지 내역",
    getUrl: "/admin/message-log-excel",
    formData: {
      ...(period.start && {
        start_date: dayjs(period.start).format("YYYY-MM-DD"),
      }),
      ...(period.end && {
        end_date: dayjs(period.end).format("YYYY-MM-DD"),
      }),
      ...(messageType && messageType !== "ALL" && { type: messageType }),
      ...(category &&
        category !== "all" && {
          is_ad: Number(Boolean(category === "ad")),
        }),
      ...(searchTerm && { keyword: searchTerm }),
      ...(sort.column && { column: sort.column }),
      ...(sort.order && { order: sort.order }),
    },
    dataType: "message",
    customFormatter: (value, key) => {
      if (key === "created_time") {
        return dayjs(value[key]).format("YYYY-MM-DD HH:mm:ss");
      } else if (key === "is_ad") {
        return value[key] === 1 ? "광고" : "단순 알림";
      } else if (key === "is_reserve") {
        return value[key] === 1 ? "예약" : "즉시";
      } else {
        return value[key];
      }
    },
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [messageType, searchTerm, category, message.page, sort]);

  return (
    <LoggedInLayout>
      <TextAtom
        fontSize={"2.4rem"}
        fontWeight={"bold"}
        color={color.mainBlue}
        marginBottom="3.4rem"
      >
        메시지 내역
      </TextAtom>
      <MessageTable
        data={message.data}
        period={period}
        setPeriod={setPeriod}
        messageType={messageType}
        setMessageType={setMessageType}
        category={category}
        setCategory={setCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        message={message}
        setMessage={setMessage}
        adminList={true}
        onChange={onChange}
        refetch={refetch}
        resetPage={resetPage}
        excelExportProps={excelExportProps}
      />
    </LoggedInLayout>
  );
};

export default Message;
