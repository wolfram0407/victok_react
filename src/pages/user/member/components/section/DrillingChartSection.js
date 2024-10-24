import { Button, Empty, Modal, Table } from "antd";
import axios from "axios";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled, { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { useAppContext } from "../../../../../utils/context";
import drillingChartTableColumn from "../column/drillingChartTableColumn";

const Container = styled.div``;

const DrillingChartSection = ({
  isDrillingChartAdd,
  setIsDrillingChartAdd,
  chartInfo,
  chartFilter,
  setChartFilter,
  customer_idx,
}) => {
  const { isAdmin } = useAppContext();
  const { grade } = useOutletContext();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  const onSelectChange = (id) => {
    setSelectedIds(id);
  };
  const rowSelection = {
    selectedIds,
    onChange: onSelectChange,
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setChartFilter((prev) => ({ ...prev, page: pagination.current }));
    // eslint-disable-next-line
  }, []);

  const onClickChartName = (row) => {
    navigate(`/member/detail/${row.customer_idx}/drillingChart/${row.idx}`);
  };

  const deleteChartMutation = useMutation(
    async () =>
      await API.post("/customer/drilling-chart-delete", { idx: selectedIds }),
    {
      onSuccess: () => {
        queryClient.fetchQuery([
          "drillingChartList",
          chartFilter,
          customer_idx,
        ]);
        Modal.success({
          title: "지공차트 삭제 완료",
          content: "선택한 지공차트가 삭제되었습니다.",
          okText: "확인",
          onOk: () => {
            setSelectedIds([]);
          },
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.error(error);
        }
      },
    }
  );

  return (
    <Container>
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
      >
        <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2rem">
          지공차트
        </TextAtom>
        {!isAdmin && (
          <RowWrapper>
            {selectedIds.length !== 0 && (
              <Button
                danger
                style={{ marginRight: "1rem" }}
                onClick={() => {
                  Modal.confirm({
                    title: "지공차트 삭제",
                    content: "선택한 지공차트를 삭제하시겠습니까?",
                    okText: "삭제",
                    onOk: () => deleteChartMutation.mutate(),
                    cancelText: "취소",
                  });
                }}
              >
                삭제
              </Button>
            )}
            <BasicButton
              focused
              onClick={() => {
                if (isDrillingChartAdd) {
                  return;
                }
                if (!isAdmin && grade === 0) {
                  return Modal.confirm({
                    title: "지공차트 등록 불가",
                    content:
                      "지공차트 관련 기능은 이용권 구매 후 이용 가능합니다. 이용권을 구매하시겠습니까?",
                    okText: "구매하기",
                    onOk: () => navigate("/goodsInfo"),
                    cancelText: "취소",
                  });
                }
                setIsDrillingChartAdd(true);
              }}
            >
              추가
            </BasicButton>
          </RowWrapper>
        )}
      </RowWrapper>
      <Table
        rowSelection={isAdmin ? false : rowSelection}
        columns={drillingChartTableColumn({ onClickChartName })}
        dataSource={chartInfo.chartList}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: chartInfo.total,
          pageSize: 10,
          showSizeChanger: false,
          current: chartFilter.page,
        }}
        rowClassName={(record, index) => (record.remain < 0 ? "grey" : "white")}
        showSorterTooltip={false}
        // scroll={{ x: 1700 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"No Data"}
            />
          ),
        }}
      />
    </Container>
  );
};

export default DrillingChartSection;
