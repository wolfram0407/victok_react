import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";
import MessageTable from "../../../../user/messageList/components/organism/MessageTable";

const MessageSection = ({ user_idx }) => {
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
    page: 1,
  });
  const [sort, setSort] = useState({
    column: null,
    order: null,
  });

  const { refetch } = useQuery(
    "storeMessageList",
    async () =>
      await API.get("/admin/message-log", {
        params: {
          user_idx,
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
          data: list.map((msg) => ({ ...msg, key: msg.idx })),
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

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [messageType, searchTerm, category, message.page, sort]);

  return (
    <>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        메시지
      </TextAtom>
      <MessageTable
        admin
        noStoreName
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
        onChange={onChange}
        resetPage={resetPage}
        refetch={refetch}
      />
    </>
  );
};

export default MessageSection;
