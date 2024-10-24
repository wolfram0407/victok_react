import { css } from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
const LockerSettingTableColumn = ({ onClickModify }) => [
  {
    title: "라카 구분",
    dataIndex: "locker_type",
    render: (name, row) => {
      return (
        <TextAtom
          fontSize={"1.4rem"}
          color={color.mainBlue}
          styles={css`
            text-decoration: underline;
            cursor: pointer;
            :hover {
              color: ${color.gold};
            }
          `}
          onClick={() => onClickModify(row)}
        >
          {name}
        </TextAtom>
      );
    },
  },
  {
    title: "라카 개수",
    dataIndex: "locker_amount",
    width: "10%",
  },
  {
    title: "알림 주기",
    dataIndex: "dday",
    width: "10%",
  },

  {
    title: "요금1",
    dataIndex: "0",
  },
  {
    title: "요금2",
    dataIndex: "1",
  },
  {
    title: "요금3",
    dataIndex: "2",
  },
  {
    title: "요금4",
    dataIndex: "3",
  },
  {
    title: "요금5",
    dataIndex: "4",
  },
  {
    title: "요금6",
    dataIndex: "5",
  },
];

export default LockerSettingTableColumn;
