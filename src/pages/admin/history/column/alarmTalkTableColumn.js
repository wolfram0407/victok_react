const alarmTalkTableColumn = () => [
  {
    title: "구분",
    dataIndex: "type",
  },
  {
    title: "시설명",
    dataIndex: "store_name",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "고객명",
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
    title: "발송일",
    dataIndex: "created_time",
    sorter: (a, b) => new Date(b) - new Date(a),
    sortDirection: ["ascend", "descend"],
  },
];

export default alarmTalkTableColumn;
