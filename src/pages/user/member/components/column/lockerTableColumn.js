import dayjs from "dayjs";

const lockerTableColumn = () => [
  {
    title: "라카 구분",
    dataIndex: "locker_type",
    sorter: true,
  },
  {
    title: "라카 번호",
    dataIndex: "locker_number",
    sorter: true,
  },
  {
    title: "금액",
    dataIndex: "charge",
    sorter: true,
  },
  {
    title: "기간",
    dataIndex: "period",
    sorter: true,
  },
  {
    title: "보증금",
    dataIndex: "charge",
    sorter: true,
  },
  {
    title: "수납 여부",
    dataIndex: "paid",
    sorter: true,
  },
  {
    title: "시작일",
    dataIndex: "start_date",
    sorter: true,
  },
  {
    title: "종료일",
    dataIndex: "end_date",
    sorter: true,
  },
  {
    title: "사용 기간",
    dataIndex: "usedPeriod",

    render: (_, row) => {
      const totalDate = dayjs(row.end_date).diff(row.start_date, "day", true);
      return totalDate - row.remain;
    },
  },
  {
    title: "남은 기간",
    dataIndex: "remain",

    render: (value) => (value <= 0 ? 0 : value),
  },
  {
    title: "상태",
    dataIndex: "status",
    sorter: true,
    render: (_, row) => {
      return row.deleted_time ? "삭제됨" : row.remain < 0 ? "만료됨" : "-";
    },
  },
];

export default lockerTableColumn;
