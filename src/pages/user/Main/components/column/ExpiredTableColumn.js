import React from "react";
import dayjs from "dayjs";
import { Switch } from "antd";
import { color } from "../../../../../styles/theme";

const expiredTableColumn = ({ onPaidChange }) => {
  return [
    {
      title: "회원 이름",
      dataIndex: "name",
    },
    {
      title: "휴대폰 번호",
      dataIndex: "phone",
    },
    {
      title: "라카 구분",
      dataIndex: "locker_type",
    },
    {
      title: "라카 번호",
      dataIndex: "locker_number",
    },
    {
      title: "금액",
      dataIndex: "charge",
    },
    {
      title: "기간",
      dataIndex: "period",
    },
    {
      title: "보증금",
      dataIndex: "deposit",
    },
    {
      title: "수납 여부",
      dataIndex: "paid",
      render: (text, row) => (
        <Switch
          onClick={() => onPaidChange(row.idx, text)}
          checkedChildren="수납"
          unCheckedChildren="미수납"
          checked={text === "수납"}
          style={{
            backgroundColor: text === "수납" ? color.mainBlue : color.unChecked,
          }}
        />
      ),
    },
    {
      title: "시작일",
      dataIndex: "start_date",
    },

    {
      title: "종료일",
      dataIndex: "end_date",
    },
    {
      title: "만료 후 (일)",
      dataIndex: "expired",
      render: (text, row) => (
        <span>
          {dayjs(dayjs().format("YYYY-MM-DD")).diff(dayjs(row.end_date), "day")}
        </span>
      ),
    },
  ];
};

export default expiredTableColumn;
