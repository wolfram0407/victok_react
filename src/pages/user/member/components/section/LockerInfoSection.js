import { Empty, Table } from "antd";
import { useCallback } from "react";
import styled from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import lockerTableColumn from "../column/lockerTableColumn";

const Container = styled.div``;

const LockerInfoSection = ({ lockerInfo, lockerFilter, setLockerFilter }) => {
  const onChange = useCallback((pagination, filters, extra) => {
    setLockerFilter((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setLockerFilter((prev) => ({
        ...prev,
        column: extra.field,
        order: extra.order === "ascend" ? "asc" : "desc",
      }));
    } else {
      setLockerFilter((prev) => ({
        ...prev,
        column: "start_date",
        order: "desc",
      }));
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2rem">
        라카 정보
      </TextAtom>
      <Table
        columns={lockerTableColumn()}
        dataSource={lockerInfo.list}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: lockerInfo.total,
          pageSize: 10,
          showSizeChanger: false,
          current: lockerFilter.page,
        }}
        rowClassName={(record) =>
          record.remain < 0 || record.deleted_time ? "grey" : "white"
        }
        showSorterTooltip={false}
        scroll={{ x: 1700 }}
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

export default LockerInfoSection;
