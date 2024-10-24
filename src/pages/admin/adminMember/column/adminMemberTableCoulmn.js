import styled from "styled-components";
import { color } from "../../../../styles/theme";

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

const adminMemberTableCoulmn = ({ onClickUsername }) => [
  {
    title: "회원 이름",
    dataIndex: "name",
    render: (name, row) => {
      return <Username onClick={() => onClickUsername(row)}>{name}</Username>;
    },
    sorter: (a, b) => a < b,
    width: 300,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
    sorter: (a, b) => a < b,
    width: 300,
    sortDirection: ["ascend", "descend"],
  },
  {
    title: "라카 사용 유무",
    dataIndex: "locker",
    width: 200,
    render: (value) => (value > 0 ? "O" : "X"),
  },
  {
    title: "이용중인 라카 수",
    width: 200,
    dataIndex: "locker",
  },
  {
    title: "지공차트 유무",
    dataIndex: "drilling_chart",
    width: 200,
    render: (data) => (data > 0 ? "O" : "X"),
  },
  {
    title: "이용 시설",
    dataIndex: "store",
    width: 600,
  },
];
export default adminMemberTableCoulmn;
