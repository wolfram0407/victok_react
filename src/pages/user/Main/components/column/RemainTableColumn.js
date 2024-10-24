import { Button, Switch } from "antd";
import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const Username = styled.span`
  border-bottom: 1px solid ${color.mainBlue};
  padding-bottom: 2px;
  color: ${color.mainBlue};
  cursor: pointer;
  &:hover {
    color: ${color.gold};
    border-bottom: 1px solid ${color.gold};
  }
`;

const remainTableColumn = ({
  onPaidChange,
  getSelectLockerInfo,
  getSelectUserInfo,
}) => [
  {
    title: "회원 이름",
    dataIndex: "name",
    render: (name, row) => (
      <Username onClick={() => getSelectUserInfo(row.idx)}>{name}</Username>
    ),
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
  },
  {
    title: "라카 구분",
    dataIndex: "locker_type",
  },
  {
    title: "라카 번호",
    dataIndex: "locker_number",
  },
  {
    title: "금액",
    dataIndex: "charge",
  },
  {
    title: "기간",
    dataIndex: "period",
  },
  {
    title: "보증금",
    dataIndex: "deposit",
  },
  {
    title: "수납 여부",
    dataIndex: "paid",
    render: (text, row) => (
      <Switch
        onClick={() => onPaidChange(row.idx, text)}
        checkedChildren="수납"
        unCheckedChildren="미수납"
        checked={text === "수납"}
        style={{
          backgroundColor: text === "수납" ? color.mainBlue : color.unChecked,
        }}
      />
    ),
  },
  {
    title: "시작일",
    dataIndex: "start_date",
  },

  {
    title: "종료일",
    dataIndex: "end_date",
  },
  {
    title: "사용 기간 (일)",
    dataIndex: "used",
  },
  {
    title: "남은 기간",
    dataIndex: "remain",
  },
  {
    title: "관리",
    dataIndex: "idx",
    render: (idx) => (
      <Button
        onClick={() => getSelectLockerInfo(idx)}
        type="primary"
        style={{ backgroundColor: color.mainBlue }}
      >
        연장
      </Button>
    ),
  },
];

export default remainTableColumn;
