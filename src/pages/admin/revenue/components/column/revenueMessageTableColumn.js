import dayjs from "dayjs";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";

const commonRender = (value, initial) => {
  return value === "initial" ? initial ?? "" : value ?? "-";
};

const amountCountRender = (value, charge, sumData, key1, key2) => {
  return value === "initial" ? (
    <span style={{ wordBreak: "keep-all", whiteSpace: "nowrap" }}>
      {`${numberToLocaleString(sumData[key1] ?? 0)} `}
      <span style={{ color: color.darkGrey }}>{`(${numberToLocaleString(
        sumData[key2] ?? 0
      )})`}</span>
    </span>
  ) : (
    <span style={{ wordBreak: "keep-all", whiteSpace: "nowrap" }}>
      {`${numberToLocaleString(value)} `}
      <span style={{ color: color.darkGrey }}>{`(${numberToLocaleString(
        charge ?? 0
      )})`}</span>
    </span>
  );
};

const dateRender = (value) => {
  return value === "initial" ? "" : dayjs(value).format("YYYY-MM-DD");
};

const revenueMessageTableColumn = ({ sumData }) => [
  {
    title: "시설명",
    dataIndex: "store_name",
    sorter: (a, b) => a < b,
    render: (value) => commonRender(value, "합계"),
  },
  {
    title: "대표명",
    dataIndex: "name",
    sorter: (a, b) => a < b,
    render: (value) => commonRender(value),
  },

  {
    title: "단문 건 수(금액)",
    dataIndex: "sms_cnt",
    sorter: (a, b) => a < b,
    render: (value, row) =>
      amountCountRender(
        value,
        row.sms_charge,
        sumData,
        "sms_cnt",
        "sms_charge"
      ),
  },
  {
    title: "장문 건 수(금액)",
    dataIndex: "lms_cnt",
    sorter: (a, b) => a < b,
    render: (value, row) =>
      amountCountRender(
        value,
        row.lms_charge,
        sumData,
        "lms_cnt",
        "lms_charge"
      ),
  },
  {
    title: "포토 건 수(금액)",
    dataIndex: "mms_cnt",
    sorter: (a, b) => a < b,
    render: (value, row) =>
      amountCountRender(
        value,
        row.mms_charge,
        sumData,
        "mms_cnt",
        "mms_charge"
      ),
  },
  {
    title: "총 건 수(금액)",
    dataIndex: "total_cnt",
    sorter: (a, b) => a < b,
    render: (value, row) =>
      amountCountRender(
        value,
        row.total_charge,
        sumData,
        "total_cnt",
        "total_charge"
      ),
  },
  {
    title: "최초 사용일",
    dataIndex: "first_used",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
    render: (value) => dateRender(value),
  },
  {
    title: "최근 사용일",
    dataIndex: "recent_used",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
    render: (value) => dateRender(value),
  },
];

export default revenueMessageTableColumn;
