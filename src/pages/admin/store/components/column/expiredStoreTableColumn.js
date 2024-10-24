import dayjs from "dayjs";
import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const ManageBtn = styled.span`
  border-bottom: 1px solid ${color.red};
  padding-bottom: 2px;
  color: ${color.red};
  cursor: pointer;
`;

const expiredStoreTableColumn = ({ onClickDelete }) => [
  {
    title: "시설명",
    dataIndex: "name",
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
  },
  {
    title: "계약기간",
    dataIndex: "period",
    render: (value) => value + "일",
  },
  {
    title: "잔여일",
    dataIndex: "end_date",
    render: (value) => {
      const renderValue = dayjs(value)
        .endOf("day")
        .diff(dayjs().endOf("day"), "day");
      const textColor = renderValue < 0 ? color.blue : color.red;
      return <span style={{ color: textColor }}>{renderValue}</span>;
    },
  },
  {
    title: "관리",
    dataIndex: "idx",
    render: (value) => (
      <ManageBtn onClick={() => onClickDelete(value)}>삭제</ManageBtn>
    ),
  },
];

export default expiredStoreTableColumn;
