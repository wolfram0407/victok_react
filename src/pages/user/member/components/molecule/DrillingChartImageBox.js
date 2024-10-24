import styled from "styled-components";
import { color } from "../../../../../styles/theme";
import { useAppContext } from "../../../../../utils/context";
import ChartInput from "../organism/ChartInput";

const ChartWrap = styled.div`
  position: relative;
  padding: 0 60px 0 30px;
`;

const Image = styled.img`
  width: 47rem;
  height: 45.8rem;
  object-fit: contain;
  margin-right: 6rem;
`;

const inputStyle = {
  position: "absolute",
  borderColor: "transparent",
  fontSize: "13px",
  padding: 0,
  textAlign: "center",
};

const inputType = {
  1: { width: "52px", height: "21px" },
  2: { width: "34px", height: "58px" },
  3: { width: "58px", height: "27px" },
  4: { width: "93px", height: "26px" },
};

const DrillingChartImageBox = ({ chartData, setChartData, setIsEdit }) => {
  const { isAdmin } = useAppContext();
  const adminStyle = isAdmin
    ? {
        backgroundColor: "white",
        color: color.black,
      }
    : null;

  const insertChartData = (e) => {
    setChartData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [e.target.name]: e.target.value,
      },
    }));
    if (Boolean(setIsEdit)) {
      setIsEdit(true);
    }
  };

  return (
    <ChartWrap>
      <Image
        src={require("../../../../../assets/images/drilling_chart.png")}
        alt="x"
      />
      {inputMap.map(({ type, left, top }, index) => {
        return (
          <ChartInput
            key={index + 1}
            name={(index + 1).toString()}
            style={{
              ...inputStyle,
              ...inputType[type],
              ...adminStyle,
              left: left + "px",
              top: top + "px",
            }}
            maxLength={2}
            value={chartData[index + 1]}
            onChange={insertChartData}
          />
        );
      })}
    </ChartWrap>
  );
};

export default DrillingChartImageBox;

const inputMap = [
  {
    type: 1,
    left: 92,
    top: 2,
  },
  {
    type: 1,
    left: 92,
    top: 26,
  },
  {
    type: 1,
    left: 306,
    top: 2,
  },
  {
    type: 1,
    left: 306,
    top: 26,
  },
  {
    type: 1,
    left: 32,
    top: 56,
  },
  {
    type: 1,
    left: 32,
    top: 80,
  },
  {
    type: 1,
    left: 152,
    top: 56,
  },
  {
    type: 1,
    left: 152,
    top: 80,
  },
  {
    type: 1,
    left: 246,
    top: 56,
  },
  {
    type: 1,
    left: 246,
    top: 80,
  },
  {
    type: 1,
    left: 366,
    top: 56,
  },
  {
    type: 1,
    left: 366,
    top: 80,
  },
  {
    type: 1,
    left: 92,
    top: 110,
  },
  {
    type: 1,
    left: 92,
    top: 134,
  },
  {
    type: 1,
    left: 306,
    top: 110,
  },
  {
    type: 1,
    left: 306,
    top: 134,
  },
  {
    type: 2,
    left: 70,
    top: 200,
  },
  {
    type: 3,
    left: 107,
    top: 201,
  },
  {
    type: 3,
    left: 107,
    top: 231,
  },
  {
    type: 2,
    left: 284,
    top: 200,
  },
  {
    type: 3,
    left: 321,
    top: 201,
  },
  {
    type: 3,
    left: 321,
    top: 231,
  },
  {
    type: 1,
    left: 92,
    top: 56,
  },
  {
    type: 1,
    left: 92,
    top: 81,
  },
  {
    type: 1,
    left: 306,
    top: 56,
  },
  {
    type: 1,
    left: 306,
    top: 81,
  },
  {
    type: 4,
    left: 405,
    top: 288,
  },
  {
    type: 1,
    left: 198,
    top: 303,
  },
  {
    type: 1,
    left: 198,
    top: 327,
  },
  {
    type: 1,
    left: 138,
    top: 357,
  },
  {
    type: 1,
    left: 138,
    top: 381,
  },
  {
    type: 1,
    left: 198,
    top: 357,
  },
  {
    type: 1,
    left: 198,
    top: 381,
  },
  {
    type: 1,
    left: 258,
    top: 357,
  },
  {
    type: 1,
    left: 258,
    top: 381,
  },
  {
    type: 1,
    left: 198,
    top: 411,
  },
  {
    type: 1,
    left: 198,
    top: 435,
  },
];
