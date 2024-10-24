import { Switch } from "antd";
import styled from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
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

const LockerCurrentColumn = ({
  onPaidChange,
  getSelectUserInfo,
  getSelectLockerInfo,
  row,
}) => [
  {
    title: "회원 이름",
    dataIndex: "name",
    sorter: true,
    render: (name, row) => {
      return (
        <Username onClick={() => getSelectUserInfo(row.idx)}>{name}</Username>
      );
    },
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
    sorter: true,
  },
  {
    title: "라카 구분",
    dataIndex: "locker_type",
    sorter: true,
  },
  {
    title: "라카 번호",
    dataIndex: "locker_number",
    sorter: true,
  },
  {
    title: "금액",
    dataIndex: "charge",
    sorter: true,
  },
  {
    title: "기간",
    dataIndex: "period",
    sorter: false,
  },
  {
    title: "보증금",
    dataIndex: "deposit",
    sorter: true,
  },
  {
    title: "수납 여부",
    dataIndex: "paid",
    sorter: true,
    width: 120,
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
    sorter: true,
  },
  {
    title: "종료일",
    dataIndex: "end_date",
    sorter: true,
  },
  {
    title: "사용 기간 (일)",
    dataIndex: "used",
    sorter: true,
  },
  {
    title: "남은 기간",
    dataIndex: "remain",
    sorter: true,
    render: (text, row) => <span>{text < 0 ? 0 : text}</span>,
  },
  {
    title: "관리",
    dataIndex: "idx",
    render: (value, row) => (
      <BasicButton focused onClick={() => getSelectLockerInfo(value, row)}>
        연장
      </BasicButton>
    ),
  },
  {
    title: "상태",
    width: 90,
    render: (text, row) => <span>{row.remain < 0 ? "만료됨" : "-"}</span>,
  },
];
export default LockerCurrentColumn;
