import React, { useEffect } from "react";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import { color } from "../../../styles/theme";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import { useState } from "react";
import { Empty, Input, Table } from "antd";
import { useCallback } from "react";
import storeTableColumn from "./components/column/storeTableColumn";
import ExpiredStoreModal from "./components/organism/ExpiredStoreModal";
import MemoModal from "./components/organism/MemoModal";
import { useQuery } from "react-query";
import { API } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { numberToLocaleString } from "../../../utils/utils";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [store, setStore] = useState({
    data: [],
    total: 0,
    page: 1,
    countMembership: 0,
    countFree: 0,
  });
  const [sort, setSort] = useState({ column: "user_idx", order: "desc" });
  const [expiredStoreModal, setExpiredStoreModal] = useState(false);
  const [memoModal, setMemoModal] = useState(false);

  const [selectedUserIdx, setSelectedUserIdx] = useState(null);
  const navigate = useNavigate();

  const convertColumn = (value) => {
    return value;
    // switch (value) {
    //   case "user_name":
    //     return "user.name";
    //   case "phone":
    //     return `user.${value}`;
    //   case "grade":
    //     return `user.${value}`;
    //   case "email":
    //     return `user.${value}`;
    //   case "store_name":
    //     return "store.name";
    //   case "amount":
    //     return "amount";
    //   default:
    //     return `store.${value}`;
    // }
  };

  const { refetch: listRefetch } = useQuery(
    "adminStoreList",
    async () =>
      await API.get("/admin/store-list", {
        params: {
          column: convertColumn(sort.column),
          order: sort.order,
          keyword: searchTerm,
          page: store.page,
          amount: 10,
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        const { list, total, countFree, countMembership } = data;
        const result = list.map((item, index) => ({
          ...item,
          use: item.count > 0 ? "O" : "X",
          key: index + 1,
        }));
        setStore((prev) => ({
          ...prev,
          data: result,
          total,
          countFree,
          countMembership,
        }));
        sessionStorage.removeItem("storeListSearchTerm");
        sessionStorage.removeItem("storeListPage");
      },
    }
  );

  const onSearch = (e) => {
    setStore((prev) => ({ ...prev, page: 1 }));
    setSearchTerm(e.target.value);
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setStore((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setSort({
        column: extra.field,
        order: extra.order === "ascend" ? "asc" : "desc",
      });
    } else {
      setSort({ column: "user_idx", order: "desc" });
    }
  }, []);

  const onOpenMemo = (user_idx) => {
    setMemoModal(true);
    setSelectedUserIdx(user_idx);
  };

  const onClickStoreName = ({ store_idx, user_idx }) => {
    navigate(`/storeDetail/${store_idx}/${user_idx}?tab=basicInfo`);
    sessionStorage.setItem("storeListSearchTerm", searchTerm);
    sessionStorage.setItem("storeListPage", store.page);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return listRefetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [store.page, searchTerm, sort]);

  useEffect(() => {
    if (sessionStorage.getItem("storeListSearchTerm")) {
      setSearchTerm(sessionStorage.getItem("storeListSearchTerm"));
    }
    if (sessionStorage.getItem("storeListPage")) {
      setStore((prev) => ({
        ...prev,
        page: parseInt(sessionStorage.getItem("storeListPage")),
      }));
    }
  }, []);

  return (
    <LoggedInLayout>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
        marginBottom={"3.2rem"}
      >
        <RowWrapper>
          <TextAtom
            fontSize={"2.4rem"}
            fontWeight={"bold"}
            color={color.mainBlue}
            marginRight={"1rem"}
          >
            가맹점
          </TextAtom>
          <TextAtom fontSize={"2.1rem"} fontWeight={500} color={color.mainBlue}>
            {`( 베이직 ${numberToLocaleString(
              store.countMembership
            )}명 / 무료 ${numberToLocaleString(store.countFree)}명 )`}
          </TextAtom>
        </RowWrapper>
        <RowWrapper>
          <BasicButton
            styles={css`
              border-color: ${color.mainBlue};
              color: ${color.mainBlue};
            `}
            marginright={"1rem"}
            onClick={() => setExpiredStoreModal(true)}
          >
            만료예정가맹점
          </BasicButton>
          <Input
            style={{ minWidth: "30rem" }}
            placeholder="대표자/휴대폰번호/시설명/주소 빠른 검색"
            value={searchTerm}
            onChange={onSearch}
          />
        </RowWrapper>
      </RowWrapper>

      <Table
        columns={storeTableColumn({ onOpenMemo, onClickStoreName })}
        dataSource={store.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: store.total,
          pageSize: 10,
          showSizeChanger: false,
          current: store.page,
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
        scroll={{ x: 1700 }}
      />
      <ExpiredStoreModal
        open={expiredStoreModal}
        onCancel={() => setExpiredStoreModal(false)}
      />
      <MemoModal
        open={memoModal}
        selectedUserIdx={selectedUserIdx}
        onCancel={() => setMemoModal(false)}
      />
    </LoggedInLayout>
  );
};

export default Store;
