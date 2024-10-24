import dayjs from "dayjs";
import { numberToLocaleString } from "../../../../../utils/utils";

const paymentListTableColumn = ({ admin }) => [
  {
    title: "빅톡 이용권",
    dataIndex: "payment_name",
  },
  {
    title: "이용 기간",
    dataIndex: "start_date",
    render: (value, row) => {
      if (!row.end_date) {
        return dayjs(value).format("YYYY.MM.DD") + "~";
      } else {
        return (
          dayjs(value).format("YYYY.MM.DD") +
          "~" +
          dayjs(row.end_date).format("YYYY.MM.DD")
        );
      }
    },
  },
  { title: "거래 날짜", dataIndex: "paid_time" },
  {
    title: "결제 금액",
    dataIndex: "amount",
    render: (value) => (value ? numberToLocaleString(value) : "-"),
  },
  {
    title: "상태",
    dataIndex: "status",
  },
];

export default paymentListTableColumn;
