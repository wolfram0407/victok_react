import {
  EditOutlined,
  LoadingOutlined,
  PrinterFilled,
} from "@ant-design/icons";
import { Button, Divider, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useMatch, useNavigate, useOutletContext } from "react-router-dom";
import ReactToPrint from "react-to-print";
import styled, { css } from "styled-components";
import { queryClient } from "../../../App";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import DrillingChart from "./components/organism/DrillingChart";
import { useAppContext } from "../../../utils/context";

const PrintTargetWrapper = styled.div`
  display: none;
`;

const DrillingChartDetail = () => {
  const { isAdmin } = useAppContext();
  const { initialChartData, initialInfoData } = useOutletContext();
  const [chartData, setChartData] = useState({
    name: "",
    data: initialChartData,
  });
  const [infoData, setInfoData] = useState(initialInfoData);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const printRef = useRef();

  const navigate = useNavigate();
  const chartParams = useMatch(
    "/member/detail/:customer_idx/drillingChart/:idx"
  ).params;

  const { data: queryData, isLoading: queryLoading } = useQuery(
    "drillingChartData",
    async () =>
      await API.get("/customer/drilling-chart", {
        params: chartParams,
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        const chartDataArr = data.chart_data.split(",");
        const chartObj = {};
        let count = 1;
        for (const num of chartDataArr) {
          chartObj[count] = num;
          count++;
        }
        setChartData((prev) => ({
          ...prev,
          name: data.chart_name,
          data: chartObj,
        }));
        setInfoData({
          name: data.name,
          hp: data.phone,
          ballName: data.ball_name,
          weight: data.weight,
          driller_idx: data.driller_idx,
          hand: data.hand,
          layout: data.layout,
          pin: data.pin,
          memo: data.memo,
        });
      },
    }
  );

  const onClickCancel = () => navigate(-1);

  const chartPreValidator = () => {
    if (!infoData.ballName)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "볼 이름을 입력해 주세요.",
        okText: "확인",
      });
    if (!infoData.weight)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "무게를 입력해 주세요.",
        okText: "확인",
      });
    if (!infoData.driller_idx)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "지공사를 선택해 주세요.",
        okText: "확인",
      });
  };

  const onEditMutation = useMutation(
    (data) => API.put("customer/drilling-chart", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "지공차트 저장 완료",
          content: "지공차트가 저장되었습니다.",
          okText: "확인",
          onOk: () => {
            navigate(-1);
          },
        });
      },
    }
  );

  const onRegisterMutation = useMutation(
    (data) => API.post("customer/drilling-chart", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "지공차트 저장 완료",
          content: "지공차트가 다른 이름으로 저장되었습니다.",
          okText: "확인",
          onOk: () => {
            navigate(-1);
          },
        });
      },
    }
  );

  const onRegisterChart = async () => {
    chartPreValidator();
    const formData = {
      customer_idx: chartParams.customer_idx,
      chart_data: Object.values(chartData.data),
      ball_name: infoData.ballName,
      weight: infoData.weight,
      driller_idx: infoData.driller_idx,
      hand: infoData.hand,
      layout: infoData.layout,
      pin: infoData.pin,
      memo: infoData.memo,
    };
    onRegisterMutation.mutate(formData);
  };

  const onEditChart = () => {
    if (!infoData.ballName)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "볼 이름을 입력해 주세요.",
        okText: "확인",
      });
    if (!infoData.weight)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "무게를 입력해 주세요.",
        okText: "확인",
      });
    if (!infoData.driller_idx)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "지공사를 선택해 주세요.",
        okText: "확인",
      });
    chartPreValidator();
    const formData = {
      chart_idx: chartParams.idx,
      chart_data: Object.values(chartData.data),
      ball_name: infoData.ballName,
      weight: infoData.weight,
      driller_idx: infoData.driller_idx,
      hand: infoData.hand,
      layout: infoData.layout,
      pin: infoData.pin,
      memo: infoData.memo,
    };
    onEditMutation.mutate(formData);
  };

  const onEditNameMutation = useMutation(
    (data) => API.put("/customer/drilling-chart-name", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("drillingChartData");
        Modal.success({
          title: "차트 제목 수정 완료",
          content: "지공차트 제목이 수정되었습니다.",
          okText: "확인",
          onOk: () => {
            setIsNameEdit((prev) => !prev);
          },
        });
      },
    }
  );

  const onEditChartName = () => {
    const formData = {
      chart_idx: chartParams.idx,
      chart_name: chartData.name,
    };
    onEditNameMutation.mutate(formData);
  };

  return (
    <LoggedInLayout paddingTop={"7rem"}>
      <WhiteBoxLayout>
        <RowWrapper
          styles={css`
            justify-content: space-between;
          `}
        >
          <RowWrapper>
            {isNameEdit ? (
              <>
                <Input
                  value={chartData.name}
                  onChange={(e) =>
                    setChartData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={{
                    width: "25rem",
                    height: "3.2rem",
                    marginRight: "1rem",
                    border: 0,
                    borderBottom: "0.1rem solid #ccc",
                    fontSize: "2rem",
                  }}
                  maxLength={10}
                  placeholder="제목을 입력해 주세요."
                />
                <Button
                  onClick={onEditChartName}
                  style={{ fontSize: "1.4rem", marginRight: "1.6rem" }}
                >
                  저장
                </Button>
              </>
            ) : (
              <>
                <TextAtom
                  fontSize={"2.2rem"}
                  fontWeight="bold"
                  marginRight={"1rem"}
                >
                  {chartData.name}
                </TextAtom>
                {!isAdmin && (
                  <EditOutlined
                    style={{
                      fontSize: "1.8rem",
                      color: color.darkGrey,
                      marginRight: "1.6rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsNameEdit(true)}
                  />
                )}
              </>
            )}

            {queryLoading ? (
              <LoadingOutlined size={"2rem"} />
            ) : (
              <TextAtom fontSize={"1.6rem"}>
                {`등록일: ${dayjs(queryData.created_time).format(
                  "YYYY.MM.DD"
                )}${
                  queryData.updated_time
                    ? ` / 수정일: ${dayjs(queryData.updated_time).format(
                        "YYYY.MM.DD"
                      )} `
                    : ""
                }`}
              </TextAtom>
            )}
          </RowWrapper>
          <RowWrapper>
            {isEdit && (
              <>
                <BasicButton
                  focused
                  marginright="0.6rem"
                  onClick={onRegisterChart}
                >
                  다른 이름으로 저장
                </BasicButton>
                <BasicButton focused marginright="0.6rem" onClick={onEditChart}>
                  저장
                </BasicButton>
              </>
            )}
            <ReactToPrint
              trigger={() => (
                <BasicButton
                  marginright={"0.6rem"}
                  styles={css`
                    padding: 0.8rem 1.6rem;
                    text-align: center;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    align-items: center;
                  `}
                >
                  <PrinterFilled />
                </BasicButton>
              )}
              content={() => printRef.current}
            />
            <BasicButton
              styles={css`
                padding: 0.8rem 1.6rem;
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
              `}
              onClick={onClickCancel}
            >
              닫기
            </BasicButton>
          </RowWrapper>
        </RowWrapper>
        <Divider style={{ marginBottom: "4.4rem" }} />
        <DrillingChart
          chartData={chartData.data}
          setChartData={setChartData}
          detail
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          infoData={infoData}
          setInfoData={setInfoData}
        />

        <PrintTargetWrapper>
          <div ref={printRef} style={{ padding: "50px 80px", width: "1200px" }}>
            <RowWrapper
              styles={css`
                margin-top: 4.8rem;
              `}
            >
              <TextAtom
                fontSize={"2.2rem"}
                fontWeight="bold"
                marginRight={"1rem"}
              >
                {chartData.name}
              </TextAtom>
              <TextAtom fontSize={"1.6rem"}>
                {`등록일: ${dayjs(queryData?.created_time).format(
                  "YYYY.MM.DD"
                )} / 수정일: ${dayjs(queryData?.updated_time).format(
                  "YYYY-MM-DD"
                )} `}
              </TextAtom>
            </RowWrapper>
            <Divider />
            <DrillingChart
              chartData={chartData.data}
              setChartData={setChartData}
              detail
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              infoData={infoData}
              setInfoData={setInfoData}
            />
          </div>
        </PrintTargetWrapper>
      </WhiteBoxLayout>
    </LoggedInLayout>
  );
};

export default DrillingChartDetail;
