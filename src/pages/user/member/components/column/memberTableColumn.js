import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const Username = styled.span`
  border-bottom: 1px solid ${color.mainBlue};
  padding-bottom: 2px;
  color: ${color.mainBlue};
  cursor: pointer;
  word-break: keep-all;
  white-space: nowrap;
  &:hover {
    color: ${color.gold};
    border-bottom: 1px solid ${color.gold};
  }
`;

const memberTableColumn = ({ onClickUsername }) => [
  {
    title: "회원 이름",
    dataIndex: "name",
    render: (name, row) => {
      return <Username onClick={() => onClickUsername(row)}>{name}</Username>;
    },
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "성별",
    dataIndex: "gender",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
    render: (gender) => {
      return gender === "M" ? "남" : gender === "F" ? "여" : "-";
    },
  },
  {
    title: "라카 사용 유무",
    dataIndex: "lockerUse",
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "이용중인 라카 수",
    dataIndex: "count",
    sorter: (a, b) => a < b,
    render: (value) => value ?? 0,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "지공차트 유무",
    dataIndex: "chartCount",
    render: (data) => <span>{data > 0 ? "O" : "X"}</span>,
    sorter: (a, b) => a < b,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "메시지 태그",
    dataIndex: "tag_names",
    render: (data) => (
      <div
        style={{
          maxWidth: "30rem",
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

export default memberTableColumn;
