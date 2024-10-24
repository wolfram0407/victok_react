const messageDetailTableColumn = () => [
  {
    title: "회원 이름",
    dataIndex: "name",
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
  },
  {
    title: "광고 수신거부",
    dataIndex: "agree_marketing",
    render: (value) => (value === "F" ? "N" : "Y"),
  },
  {
    title: "상태",
    dataIndex: "state",
  },
  {
    title: "설명",
    dataIndex: "description",
    render: (value) => (value?.length > 0 ? value : "-"),
  },
];

export default messageDetailTableColumn;
