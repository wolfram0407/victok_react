import { FileAddFilled } from "@ant-design/icons";
import styled from "styled-components";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";

const StoreName = styled.span`
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

const storeTableColumn = ({ onOpenMemo, onClickStoreName }) => [
  {
    title: "대표자",
    dataIndex: "user_name",
    sorter: true,
  },
  {
    title: "휴대폰 번호",
    dataIndex: "phone",
    sorter: true,
  },
  {
    title: "구분",
    dataIndex: "grade",
    sorter: true,
    render: (data) => (
      <span style={{ color: data === 1 ? color.gold : color.mainBlue }}>
        {data === 0 ? "무료" : data === 1 ? "베이직" : "-"}
      </span>
    ),
  },
  {
    title: "시설명",
    dataIndex: "store_name",
    sorter: true,
    render: (value, row) => (
      <StoreName
        onClick={() =>
          onClickStoreName({ store_idx: row.idx, user_idx: row.user_idx })
        }
      >
        {value}
      </StoreName>
    ),
  },
  {
    title: "주소",
    dataIndex: "address1",
    sorter: true,
  },
  {
    title: "시설 연락처",
    dataIndex: "contact",
    sorter: true,
  },
  {
    title: "이용권 금액",
    dataIndex: "amount",
    sorter: true,
    render: (value) =>
      value && Boolean(Number(value)) ? numberToLocaleString(value) : "-",
  },
  {
    title: "사용 금액",
    dataIndex: "message_charge",
    sorter: true,
    render: (value) => (value ? numberToLocaleString(value) : "-"),
  },
  {
    title: "가입일",
    dataIndex: "created_time",
    sorter: true,
  },
  {
    title: "메모",
    dataIndex: "memo_count",
    sorter: true,
    render: (value, row) => {
      return (
        <FileAddFilled
          onClick={() => onOpenMemo(row.user_idx)}
          style={{
            fontSize: 20,
            color: value && value > 0 ? color.mainBlue : color.grey,
            cursor: "pointer",
          }}
        />
      );
    },
  },
];

export default storeTableColumn;
