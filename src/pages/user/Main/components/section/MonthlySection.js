import { Empty, Table } from "antd";
import { useCallback } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";

import BasicButton from "../../../../../components/atom/BasicButton";
import TextAtom from "../../../../../components/atom/TextAtom";
import WhiteBoxLayout from "../../../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import expiredTableColumn from "../column/ExpiredTableColumn";
import remainTableColumn from "../column/RemainTableColumn";
import {
  lockerListResultFormat,
  numberToLocaleString,
} from "../../../../../utils/utils";
import { queryClient } from "../../../../../App";
import useGetLockerList from "../../../../../hooks/useGetLockerList";
import { useEffect } from "react";

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const MonthlySection = ({ setCreateLockerUserModal }) => {
  const [displayMonthly, setDisplayMonthly] = useState("remain");
  const [isDisplay, setIsDisplay] = useState(false);
  const [remainData, setRemainData] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [expiredData, setExpiredData] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [selectedLockerIdx, setSelectedLockerIdx] = useState("");
  const [selectedLockerIdxUser, setSelectedLockerIdxUser] = useState("");

  const { isLoading: remainDataLoading, refetch: remainDataRefetch } =
    useGetLockerList({
      dataKey: "lockerRemainData",
      type: "remain",
      formData: { page: remainData.page, amount: 5 },
      onSuccess: (data) => {
        const result = lockerListResultFormat(data.list);
        setRemainData((prev) => ({
          ...prev,
          data: result,
          total: data.total,
        }));
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { isLoading: expiredDataLoading, refetch: expiredDataRefetch } =
    useGetLockerList({
      dataKey: "lockerExpiredData",
      type: "expired",
      formData: { page: expiredData.page, amount: 5 },
      onSuccess: (data) => {
        const result = lockerListResultFormat(data.list);
        setExpiredData((prev) => ({
          ...prev,
          data: result,
          total: data.total,
        }));
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const changeMutation = useMutation(
    (data) => API.put("/locker/locker-paid", data),
    {
      onMutate: (data) => {
        let displayData;
        if (displayMonthly === "remain") {
          displayData = "lockerRemainData";
        }
        if (displayMonthly === "expired") {
          displayData = "lockerExpiredData";
        }
        queryClient.fetchQuery(displayData);
      },
    }
  );

  const onPaidChange = (idx, paid) => {
    changeMutation.mutate({ locker_idx: idx, paid });
  };

  const onChangeRemainData = useCallback((pagination, filters, extra) => {
    setRemainData((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  const onChangeExpiredData = useCallback((pagination, filters, extra) => {
    setExpiredData((prev) => ({
      ...prev,
      page: pagination.current,
    }));
  }, []);

  // 라카현황 리스트 테이블 내에서 각 테이블 로우의 '연장' 버튼 눌렀을 때,
  // 선택된 라커 정보 불러오는 쿼리
  useQuery(
    ["selectLockerInfo", selectedLockerIdx],
    async () => {
      if (!selectedLockerIdx) return;
      return await API.get("/locker/locker-info", {
        params: { locker_idx: selectedLockerIdx },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setCreateLockerUserModal(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const getSelectLockerInfo = (idx) => {
    setSelectedLockerIdx(idx);
  };

  // 라카현황 리스트 테이블 내에서 각 테이블 로우의 '회원이름' 눌렀을 때,
  // 선택된 라커 정보 불러오는 쿼리
  useQuery(
    ["selectedUserInfo", selectedLockerIdxUser],
    async () => {
      if (!selectedLockerIdxUser) return;
      return await API.get("/locker/user-info", {
        params: { locker_idx: selectedLockerIdxUser },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setCreateLockerUserModal(data);
      },
    }
  );

  const getSelectUserInfo = (idx) => {
    setSelectedLockerIdxUser(idx);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return expiredDataRefetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [expiredData.page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return remainDataRefetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [remainData.page]);

  return (
    <WhiteBoxLayout marginBottom={"2.4rem"}>
      <Row marginBottom={isDisplay ? "3rem" : 0}>
        <Wrapper>
          <TextAtom
            fontSize={"2.2rem"}
            fontWeight="bold"
            marginRight={"2.4rem"}
          >
            {`${
              displayMonthly === "remain" ? "남은 기간" : "만료된 지"
            } 30일 이내`}
          </TextAtom>
          <BasicButton
            focused={displayMonthly === "remain"}
            onClick={() => setDisplayMonthly("remain")}
            marginright="0.6rem"
          >
            Soon
          </BasicButton>
          <BasicButton
            focused={displayMonthly === "expired"}
            onClick={() => setDisplayMonthly("expired")}
            marginright="1.2rem"
          >
            Already
          </BasicButton>
          <TextAtom
            fontSize={"1.8rem"}
            fontWeight="nomal"
            marginRight={"2.4rem"}
          >
            ({" "}
            <span style={{ color: color.gold }}>{`${numberToLocaleString(
              displayMonthly === "remain" ? remainData.total : expiredData.total
            )}`}</span>
            명 )
          </TextAtom>
        </Wrapper>
        <BasicButton
          focused={false}
          onClick={() => setIsDisplay((prev) => !prev)}
        >
          {isDisplay ? "접기" : "펼치기"}
        </BasicButton>
      </Row>
      {isDisplay && (
        <>
          {displayMonthly === "remain" && (
            <Table
              dataSource={remainData.data}
              columns={remainTableColumn({
                onPaidChange,
                getSelectLockerInfo,
                getSelectUserInfo,
              })}
              style={{ borderTop: `2px solid ${color.mainBlue}` }}
              scroll={{ x: 1700 }}
              onChange={onChangeRemainData}
              pagination={{
                total: remainData.total,
                pageSize: 5,
                showSizeChanger: false,
                current: remainData.page,
              }}
              loading={remainDataLoading}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={"No Data"}
                  />
                ),
              }}
            />
          )}
          {displayMonthly === "expired" && (
            <Table
              dataSource={expiredData.data}
              columns={expiredTableColumn({ onPaidChange })}
              style={{ borderTop: `2px solid ${color.mainBlue}` }}
              scroll={{ x: 1700 }}
              onChange={onChangeExpiredData}
              pagination={{
                total: expiredData.total,
                pageSize: 5,
                showSizeChanger: false,
                current: expiredData.page,
              }}
              loading={expiredDataLoading}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={"No Data"}
                  />
                ),
              }}
            />
          )}
        </>
      )}
    </WhiteBoxLayout>
  );
};

export default MonthlySection;
