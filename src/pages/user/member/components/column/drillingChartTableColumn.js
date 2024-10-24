import dayjs from "dayjs";
import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const ChartName = styled.span`
  border-bottom: 1px solid ${color.mainBlue};
  padding-bottom: 2px;
  color: ${color.mainBlue};
  cursor: pointer;
  &:hover {
    color: ${color.gold};
    border-bottom: 1px solid ${color.gold};
  }
`;

const drillingChartTableColumn = ({ onClickChartName }) => [
  {
    title: "날짜",
    width: "140px",
    dataIndex: "updated_time",
    render: (value, row) => {
      const displayTime = value ? value : row.created_time;
      return dayjs(displayTime).format("YYYY-MM-DD");
    },
  },
  {
    title: "제목",
    width: "140px",
    dataIndex: "chart_name",
    render: (value, row) => {
      return (
        <ChartName onClick={() => onClickChartName(row)}>{value}</ChartName>
      );
    },
  },
  {
    title: "공이름",
    dataIndex: "ball_name",
  },
  {
    title: "무게(lbs)",
    width: "110px",
    dataIndex: "weight",
    render: (value) => {
      return value + " lbs";
    },
  },
  {
    title: "레이아웃",
    dataIndex: "layout",
    render: (value, row) => {
      return `${value ? value : "-"} / ${row.pin === "up" ? "핀업" : "핀다운"}`;
    },
  },
  {
    title: "지공사",
    dataIndex: "driller",
  },
  {
    title: "상담 내용",
    dataIndex: "memo",
    render: (value) => (
      <div
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {value ? value : "-"}
      </div>
    ),
  },
];

export default drillingChartTableColumn;
