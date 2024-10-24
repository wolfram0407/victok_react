import { Divider, Modal } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { useAppContext } from "../../../utils/context";
import BoxLayout from "../messagePost/components/atom/BoxLayout";
import MessageTable from "./components/organism/MessageTable";

const MessageList = () => {
  const { grade, gradeLoading } = useOutletContext();
  const [period, setPeriod] = useState({
    start: null,
    end: null,
  });
  const [messageType, setMessageType] = useState("");
  const [category, setCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({
    data: [],
    total: 0,
    page: 1,
  });

  const [sort, setSort] = useState({
    column: "created_time",
    order: "DESC",
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { termList } = useAppContext();
  const { refetch } = useQuery(
    "messageList",
    async () =>
      await API.get("/message/message-list", {
        params: {
          ...(period.start && {
            start_date: dayjs(period.start).startOf("day").format("YYYY-MM-DD"),
          }),
          ...(period.end && {
            end_date: dayjs(period.end).endOf("day").format("YYYY-MM-DD"),
          }),
          ...(messageType !== "ALL" && { type: messageType }),
          ...(category &&
            category !== "all" && {
              is_ad: Number(Boolean(category === "ad")),
            }),
          keyword: searchTerm,
          page: message.page,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        setMessage({
          ...message,
          data: data.list.map((item) => ({ ...item, key: item.idx })),
          total: data.total,
        });
      },
      retry: false,
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

  const onClickFaq = () =>
    window.open(
      termList.find((term) => term.title.toLowerCase() === "faq").url
    );

  useEffect(() => {
    const debounce = setTimeout(() => {
      return refetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [messageType, searchTerm, category, message.page, sort]);

  useEffect(() => {
    if (gradeLoading) return;
    if (grade === 0) {
      Modal.confirm({
        title: "메시지 내역 확인 불가",
        content:
          "메시지 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
        okText: "구매하기",
        onOk: () => navigate("/goodsInfo"),
        cancelText: "취소",
        onCancel: () => navigate(-1),
      });
    }
    // eslint-disable-next-line
  }, [grade, gradeLoading]);

  return (
    <LoggedInLayout paddingBottom={"5rem"}>
      {grade !== 0 && (
        <WhiteBoxLayout>
          <RowWrapper>
            <TextAtom
              fontSize={"2.2rem"}
              fontWeight="bold"
              marginRight={"3rem"}
            >
              메시지
            </TextAtom>
            <BasicButton
              focused={pathname === "/messagePost"}
              marginright={"0.6rem"}
              onClick={() => navigate("/messagePost")}
            >
              메시지 전송
            </BasicButton>
            <BasicButton
              focused={pathname === "/messageList"}
              marginright={"1rem"}
              onClick={null}
            >
              전송 내역
            </BasicButton>
            <BasicButton
              styles={css`
                border: 0.1rem solid ${color.mainBlue};
                color: ${color.mainBlue};
              `}
              onClick={() =>
                navigate("/setting?tab=tag", { state: { tab: "tag" } })
              }
            >
              태그 설정하기
            </BasicButton>
          </RowWrapper>
          <Divider />
          <BoxLayout
            flexDirection={"column"}
            styles={css`
              padding: 2rem 3rem;
            `}
            marginBottom="1.6rem"
          >
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
              onChange={onChange}
              refetch={refetch}
              resetPage={resetPage}
            />
          </BoxLayout>
          <TextAtom fontSize={"1.6rem"}>
            메시지 전송 관련{" "}
            <span
              style={{
                color: color.mainBlue,
                textDecoration: "underLine",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={onClickFaq}
            >
              자주 묻는 질문
            </span>
          </TextAtom>
        </WhiteBoxLayout>
      )}
    </LoggedInLayout>
  );
};

export default MessageList;
