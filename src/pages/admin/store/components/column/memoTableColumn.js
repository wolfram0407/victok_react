import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const ManageBtn = styled.span`
  border-bottom: 1px solid ${color.red};
  padding-bottom: 2px;
  color: ${color.red};
  cursor: pointer;
`;

const memoTableColumn = ({ onClickDelete }) => [
  {
    title: "입력일시",
    dataIndex: "created_time",
  },
  {
    title: "메모 내용",
    dataIndex: "memo",
  },
  {
    title: "관리",
    dataIndex: "idx",
    width: 80,
    render: (value) => (
      <ManageBtn onClick={() => onClickDelete(value)}>삭제</ManageBtn>
    ),
  },
];

export default memoTableColumn;
