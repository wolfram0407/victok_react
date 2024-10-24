import { numberToLocaleString } from "../../../../utils/utils";

const lockerTableColumn = () => [
  {
    title: "처리 내용",
    dataIndex: "type",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "처리일",
    dataIndex: "handled_time",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "시설 유형",
    dataIndex: "store_type",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "시설명",
    dataIndex: "store_name",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "이름",
    dataIndex: "customer_name",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "휴대폰번호",
    dataIndex: "customer_phone",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "라카 구분",
    dataIndex: "locker_type",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "라카 번호",
    dataIndex: "locker_number",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "금액",
    dataIndex: "charge",
    render: (value) => (value ? numberToLocaleString(value) : "-"),
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "시작일",
    dataIndex: "start_date",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "종료일",
    dataIndex: "end_date",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
  },
];

export default lockerTableColumn;
