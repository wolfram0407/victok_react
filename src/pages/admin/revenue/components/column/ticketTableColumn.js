import dayjs from "dayjs";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";

const commonRender = (value, initial) => {
  return value === "initial" ? initial ?? "" : value ?? "-";
};

const dateRender = (value) => {
  return value === "initial" ? "" : dayjs(value).format("YYYY-MM-DD");
};

const amountCountRender = (value, total, data) => {
  return value === "initial"
    ? total && total[data]
      ? numberToLocaleString(total[data])
      : "-"
    : value
    ? numberToLocaleString(value)
    : "-";
};

const ticketTableColumn = ({ sumData, onClickManage }) => [
  {
    title: "시설명",
    dataIndex: "storeName",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (value) => commonRender(value, "합계"),
  },
  {
    title: "대표명",
    dataIndex: "userName",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (value) => commonRender(value),
  },

  {
    title: "결제일",
    dataIndex: "paid_time",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
    render: (value) => dateRender(value),
  },
  {
    title: "이용기간",
    dataIndex: "start_date",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
    render: (value, row) =>
      value === "initial"
        ? ""
        : `${dateRender(value)} ~ ${
            row.end_date ? dateRender(row.end_date) : ""
          }`,
  },
  {
    title: "결제금액",
    dataIndex: "paymentAmount",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (value) => amountCountRender(value, sumData, "totalAmount"),
  },
  {
    title: "알림톡 건 수",
    dataIndex: "talkCount",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (value) => amountCountRender(value, sumData, "totalTalk"),
  },
  {
    title: "취소/환불 금액",
    dataIndex: "refundAmount",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (value) => amountCountRender(value, sumData, "totalRefund"),
  },
  {
    title: "취소/환불 메모",
    dataIndex: "refundMemo",
    render: (value) => commonRender(value, ""),
  },
  {
    title: "관리",
    dataIndex: "paymentIdx",
    render: (value, row) =>
      value === "initial" ? (
        "-"
      ) : (
        <BasicButton
          onClick={() => onClickManage(value)}
          // disabled={row.refundAmount}
          styles={css`
            background-color: ${color.mainBlue};
            color: ${color.white};
          `}
        >
          취소
        </BasicButton>
      ),
  },
];

export default ticketTableColumn;
