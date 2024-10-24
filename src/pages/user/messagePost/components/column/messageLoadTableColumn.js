import { css } from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
const messageLoadTableColumn = ({ onClickData }) => [
  {
    title: "메시지 내용",
    dataIndex: "msg",
    align: "center",
    render: (value, row) => {
      return (
        <TextAtom
          fontSize={"1.4rem"}
          onClick={() => onClickData(row)}
          ellipsis
          styles={css`
            cursor: pointer;
            text-align: start;
          `}
        >
          {value}
        </TextAtom>
      );
    },
  },
];

export default messageLoadTableColumn;
