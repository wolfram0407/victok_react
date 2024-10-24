import { DatePicker, Empty, Input, Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import styled, { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import ExcelButtonAdmin from "../../../../../components/organism/ExcelButtonAdmin";
import SelectList from "../../../../../components/organism/SelectList";
import { color } from "../../../../../styles/theme";
import {
  messageCategoryList,
  messageTypeList,
} from "../../../../../utils/constans";
import { useAppContext } from "../../../../../utils/context";
import { numberToLocaleString } from "../../../../../utils/utils";
import messageListTableColumn from "../column/messageListTableColumn";
import MessageDetailModal from "./MessageDetailModal";
import MessageMoreModal from "./MessageMoreModal";

const Container = styled.div`
  width: 100%;
`;

const DividerLine = styled.div`
  width: 0.1rem;
  height: 1rem;
  background-color: ${color.darkGrey};
  margin: 0 1rem;
`;

const MessageTable = ({
  adminList,
  data,
  period,
  setPeriod,
  messageType,
  setMessageType,
  category,
  setCategory,
  searchTerm,
  setSearchTerm,
  message,
  setMessage,
  onChange,
  refetch,
  resetPage,
  excelExportProps,
  noStoreName,
}) => {
  const { isAdmin: admin } = useAppContext();
  const [messageMoreModal, setMessageMoreModal] = useState(false);
  const [showMoreData, setShowMoreData] = useState({
    body: "",
    type: "",
    img_cnt: 0,
    title: "",
  });
  const [messageDetailModal, setMessageDetailModal] = useState({
    open: false,
    idx: null,
    user_idx: null,
  });

  const onClickShowMore = (body, type, img_cnt, title) => {
    setMessageMoreModal(true);
    setShowMoreData({ body, type, img_cnt, title });
  };

  const onClickDetail = (idx, user_idx) => {
    setMessageDetailModal({ open: true, idx, user_idx });
  };
  return (
    <Container>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
        marginBottom={admin ? "2rem" : "1rem"}
      >
        <RowWrapper>
          <TextAtom fontSize={"1.8rem"} fontWeight={500} marginRight="1rem">
            조회 기간
          </TextAtom>
          <DatePicker
            style={{ width: "14rem" }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod((prev) => ({ ...prev, start: e }))}
            value={period.start}
          />
          <TextAtom
            fontSize={"1.4rem"}
            fontWeight={600}
            marginLeft="0.6rem"
            marginRight="0.6rem"
          >
            ~
          </TextAtom>
          <DatePicker
            style={{ width: "14rem", marginRight: "1rem" }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod((prev) => ({ ...prev, end: e }))}
            value={period.end}
            disabledDate={(current) => {
              if (period.start) {
                return current && current < dayjs(period.start).endOf("day");
              }
            }}
          />
          <BasicButton
            onClick={() => {
              resetPage();
              refetch();
            }}
          >
            검색
          </BasicButton>
          {adminList && <ExcelButtonAdmin {...excelExportProps} leftMargined />}
        </RowWrapper>
        <RowWrapper>
          <SelectList
            optionList={messageTypeList}
            onChange={(e) => {
              resetPage();
              setMessageType(e.toUpperCase());
            }}
            placeholder="메시지 타입"
          />
          <SelectList
            optionList={messageCategoryList}
            onChange={(e) => {
              resetPage();
              setCategory(e);
            }}
            width={"10rem"}
            placeholder="유형"
          />

          <Input
            placeholder={
              adminList
                ? "이름/연락처/시설명/문자내용 빠른 검색"
                : "이름/연락처/문자내용 빠른 검색"
            }
            value={searchTerm}
            onChange={(e) => {
              resetPage();
              setSearchTerm(e.target.value);
            }}
            style={{ width: adminList ? "28rem" : "25rem" }}
          />
        </RowWrapper>
      </RowWrapper>
      {admin && (
        <RowWrapper marginBottom={"1rem"}>
          <TextAtom fontSize={"1.4rem"} fontWeight={600}>
            총{" "}
            <span style={{ color: color.gold }}>
              {message.total ? numberToLocaleString(message.total) : 0}
            </span>{" "}
            개
          </TextAtom>
          <DividerLine />
          <TextAtom fontSize={"1.4rem"} fontWeight={600}>
            총{" "}
            <span style={{ color: color.gold }}>
              {message.totalFee ? numberToLocaleString(message.totalFee) : 0}
            </span>{" "}
            원
          </TextAtom>
        </RowWrapper>
      )}
      <Table
        columns={messageListTableColumn({
          onClickShowMore,
          onClickDetail,
          noStoreName,
          isAdmin: admin,
        })}
        dataSource={data}
        onChange={onChange}
        style={{ width: "100%", borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: message.total,
          pageSize: 10,
          showSizeChanger: false,
          current: message.page,
        }}
        showSorterTooltip={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"No Data"}
            />
          ),
        }}
      />
      <MessageMoreModal
        open={messageMoreModal}
        onCancel={() => setMessageMoreModal(false)}
        showMoreData={showMoreData}
      />
      <MessageDetailModal
        open={messageDetailModal.open}
        idx={messageDetailModal.idx}
        user_idx={messageDetailModal.user_idx}
        onCancel={() => setMessageDetailModal({ open: false, idx: null })}
      />
    </Container>
  );
};

export default MessageTable;
