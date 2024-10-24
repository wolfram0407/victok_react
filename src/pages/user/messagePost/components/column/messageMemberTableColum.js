const messageMemberTableColum = () => [
  {
    title: "이름",
    dataIndex: "name",
    sorter: true,
    render: (d) => (
      <div style={{ wordBreak: "keep-all", whiteSpace: "nowrap" }}>{d}</div>
    ),
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
    sorter: true,
  },
  {
    title: "라카 사용 유무",
    dataIndex: "use",
    sorter: true,
  },
  {
    title: "이용중인 라카 수",
    dataIndex: "count",
    sorter: true,
  },
  {
    title: "지공차트 유무",
    dataIndex: "chartCount",
    render: (data) => <span>{data > 0 ? "O" : "X"}</span>,
    sorter: true,
  },
  {
    title: "메시지 태그",
    dataIndex: "tag_names",
    render: (data) => (
      <div
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {data ? data : "-"}
      </div>
    ),
  },
  {
    title: "메모",
    dataIndex: "memo",
    render: (data) => (
      <div
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {data ? data : "-"}
      </div>
    ),
  },
];

export default messageMemberTableColum;
