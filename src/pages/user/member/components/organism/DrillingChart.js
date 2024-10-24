import RowWrapper from "../../../../../components/atom/RowWrapper";
import DrillingChartInfoBox from "../molecule/DrillingChartInfoBox";
import DrillingChartImageBox from "../molecule/DrillingChartImageBox";

const DrillingChart = ({
  chartData,
  setChartData,
  detail,
  isEdit,
  setIsEdit,
  infoData,
  setInfoData,
  setDrillerName,
}) => {
  return (
    <RowWrapper>
      <DrillingChartImageBox
        chartData={chartData}
        setChartData={setChartData}
        detail={detail}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <DrillingChartInfoBox
        infoData={infoData}
        setInfoData={setInfoData}
        detail={detail}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setDrillerName={setDrillerName}
      />
    </RowWrapper>
  );
};

export default DrillingChart;
