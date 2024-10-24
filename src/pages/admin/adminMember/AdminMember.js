import { Input, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { css } from "styled-components";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { numberToLocaleString } from "../../../utils/utils";
import adminMemberTableCoulmn from "./column/adminMemberTableCoulmn";

const AdminMember = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [member, setMember] = useState({
    data: [],
    total: 0,
    page: 1,
  });
  const [sort, setSort] = useState({
    column: null,
    order: null,
  });

  const { refetch: listRefetch } = useQuery(
    "adminCustomerList",
    async () =>
      await API.get("/admin/customer-list", {
        params: {
          keyword: searchTerm,
          page: member.page,
          amount: 10,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }).then((res) => res.data),
    {
      onSuccess: (data) => {
        const { list, total } = data;
        setMember((prev) => ({
          ...prev,
          data: list.map((item, index) => ({ ...item, key: index })),
          total,
        }));
        sessionStorage.removeItem("memberListSearchTerm");
        sessionStorage.removeItem("memberListPage");
      },
    }
  );

  const onSearch = (e) => {
    setMember((prev) => ({ ...prev, page: 1 }));
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();

  const onChange = useCallback((pagination, filters, extra) => {
    setMember((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setSort({
        column: extra.field,
        order: extra.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setSort({ column: null, order: null });
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return listRefetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [member.page, searchTerm, sort]);

  useEffect(() => {
    if (sessionStorage.getItem("memberListSearchTerm")) {
      setSearchTerm(sessionStorage.getItem("memberListSearchTerm"));
    }
    if (sessionStorage.getItem("memberListPage")) {
      setMember((prev) => ({
        ...prev,
        page: parseInt(sessionStorage.getItem("memberListPage")),
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
            회원
          </TextAtom>
          <TextAtom fontSize={"2.1rem"} fontWeight={500} color={color.mainBlue}>
            {`( ${numberToLocaleString(member.total)} 명 )`}
          </TextAtom>
        </RowWrapper>
        <TextAtom
          fontSize={"2.4rem"}
          fontWeight={"bold"}
          color={color.mainBlue}
        ></TextAtom>
        <Input
          style={{ width: "30rem" }}
          placeholder="이름/연락처/이용시설 빠른 검색"
          value={searchTerm}
          onChange={onSearch}
        />
      </RowWrapper>
      <Table
        columns={adminMemberTableCoulmn({
          onClickUsername: (row) => {
            navigate(`detail/${row.idx}`);
            sessionStorage.setItem("memberListSearchTerm", searchTerm);
            sessionStorage.setItem("memberListPage", member.page);
          },
        })}
        dataSource={member.data}
        onChange={onChange}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        pagination={{
          total: member.total,
          pageSize: 10,
          showSizeChanger: false,
          current: member.page,
        }}
        showSorterTooltip={false}
        scroll={{ x: 1700 }}
      />
    </LoggedInLayout>
  );
};

export default AdminMember;
