import { AutoComplete, Empty, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled, { css } from "styled-components";
import { queryClient } from "../../../App";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { numberToLocaleString } from "../../../utils/utils";
import memberTableColumn from "./components/column/memberTableColumn";
import CreateMemberModal from "./components/organism/CreateMemberModal";

const BannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 7rem 2rem;
  flex-shrink: 0;
  width: 160px;
  gap: 1rem;
`;

const BannerImg = styled.img`
  width: 160px;
  height: 300px;
  @media screen and (max-width: 1200px) {
    width: 0;
    height: 0;
  }
`;

const Member = () => {
  const {
    adData: { customer = {} },
    adRefetch,
  } = useOutletContext();
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({
    keyword: "",
    page: 1,
    amount: 10,
    column: null,
    order: null,
  });
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [createMemberModal, setCreateMemberModal] = useState(false);

  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

  const getAllMemberKey = "allMemberData";

  const { refetch: getAllMemberRefetch, isLoading } = useQuery(
    getAllMemberKey,
    () =>
      API.get("/locker/customer-list", {
        params: {
          keyword: sort.keyword,
          page: sort.page,
          amount: sort.amount,
          need_cnt: 1,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
        },
      }),
    {
      onSuccess: ({ data }) => {
        const result = data.list.map((item) => ({
          ...item,
          key: item.idx,
          use: item.count > 0 ? "O" : "X",
          memo: item.memo
            ? item.memo !== ("null" || "undefined")
              ? item.memo
              : "-"
            : "-",
        }));
        setData(result);
        setTotal(data.total);
        sessionStorage.removeItem("memberListSearchTerm");
        sessionStorage.removeItem("memberListPage");
      },
    }
  );

  const memberDeleteMutation = useMutation(
    () =>
      API.post("/customer/customer-delete", {
        idx: selectedIds.join(","),
      }),
    {
      onSuccess: () => {
        Modal.success({
          title: "회원 삭제 완료",
          content: "선택하신 회원이 삭제되었습니다.",
          okText: "확인",
          onOk: () => {
            setSelectedIds([]);
          },
        });
        queryClient.fetchQuery(getAllMemberKey);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          // console.log(error);
          Modal.error({
            title: "회원 삭제 실패",
            content:
              "라카를 이용 중이거나, 라카 만료 상태이며 연장 가능한 상태인 회원은 삭제할 수 없습니다. (연장 가능 상태인 만료된 라카 삭제 후 회원 삭제 가능)",
            okText: "확인",
          });
        }
      },
    }
  );

  const onSelectChange = (selectedIds) => {
    setSelectedIds(selectedIds);
  };

  const rowSelection = {
    selectedIds,
    onChange: onSelectChange,
  };

  const navigate = useNavigate();

  const onChange = useCallback((pagination, filters, extra) => {
    setSort((prev) => ({ ...prev, page: pagination.current }));
    if (extra.order) {
      setSort((prev) => ({
        ...prev,
        column: extra.field,
        order: extra.order === "ascend" ? "ASC" : "DESC",
      }));
    } else {
      setSort((prev) => ({ ...prev, column: null, order: null }));
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getAllMemberRefetch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [sort]);

  useEffect(() => {
    if (sessionStorage.getItem("memberListSearchTerm")) {
      setSort((prev) => ({
        ...prev,
        keyword: sessionStorage.getItem("memberListSearchTerm"),
      }));
    }
    if (sessionStorage.getItem("memberListPage")) {
      setSort((prev) => ({
        ...prev,
        page: parseInt(sessionStorage.getItem("memberListPage")),
      }));
    }
  }, []);

  useEffect(() => {
    adRefetch();
    // eslint-disable-next-line
  }, []);
  // Object.values(customer).findIndex((item) => item.show === 1) !== 1
  return (
    <LoggedInLayout
      styles={css`
        flex-direction: row;
      `}
    >
      <WhiteBoxLayout>
        <RowWrapper
          styles={css`
            justify-content: space-between;
          `}
          marginBottom="3rem"
        >
          <TextAtom fontSize={"2.2rem"} fontWeight={700}>
            {`회원 ( ${numberToLocaleString(total)}명 ) `}
          </TextAtom>
          <RowWrapper
            styles={css`
              gap: 1rem;
            `}
          >
            <BasicButton
              styles={css`
                border-color: ${color.mainBlue};
                color: ${color.mainBlue};
              `}
              onClick={() => setCreateMemberModal(true)}
            >
              회원 등록
            </BasicButton>

            <AutoComplete
              style={{ width: "25rem" }}
              placeholder="이름/연락처/태그/메모 빠른 검색"
              value={sort.keyword}
              onChange={(str) => {
                setSort((prev) => ({ ...prev, keyword: str }));
              }}
              onSelect={(str) => {
                setSort((prev) => ({ ...prev, keyword: str }));
              }}
              options={autoCompleteOptions}
              onSearch={(str) => {
                const optionMapper = (type) => {
                  if (type === "tag_names") {
                    let tagsList = [];
                    const memberDataArr = data.map((i) =>
                      i[type] ? i[type].split(", ") : []
                    );
                    memberDataArr.forEach((tagArr) => {
                      tagArr.forEach((tag) => {
                        if (!tagsList.includes(tag)) {
                          if (tag.includes(str)) {
                            tagsList.push(tag);
                          }
                        }
                      });
                    });
                    return tagsList.map((tag) => ({
                      value: tag,
                      label: tag,
                    }));
                  } else {
                    const targetArr = data
                      .map((i) => i[type])
                      .filter((i) => i !== null);
                    if (!targetArr) return [];
                    return [
                      ...targetArr
                        .map((t) => {
                          if (t.includes(str)) {
                            return { value: t, label: t };
                          } else {
                            return null;
                          }
                        })
                        .filter((i) => i !== null),
                    ];
                  }
                };
                let newOptions = [];
                ["name", "phone", "tag_names", "gender"].forEach((type) => {
                  const result = optionMapper(type);
                  if (result.length > 0) {
                    return (newOptions = [...newOptions, ...result]);
                  }
                });
                setAutoCompleteOptions(!str ? [] : newOptions);
              }}
            />
            {selectedIds.length !== 0 && (
              <BasicButton
                styles={css`
                  color: ${color.red};
                  border-color: ${color.red};
                `}
                onClick={() =>
                  Modal.confirm({
                    title: "회원 삭제",
                    content: "선택하신 회원을 삭제하시겠습니까?",
                    okText: "삭제",
                    onOk: () => memberDeleteMutation.mutate(),
                    cancelText: "취소",
                    onCancel: () => console.log("취소"),
                  })
                }
              >
                선택 삭제
              </BasicButton>
            )}
          </RowWrapper>
        </RowWrapper>
        <Table
          columns={memberTableColumn({
            onClickUsername: (row) => {
              navigate(`/member/detail/${row.idx}`);
              sessionStorage.setItem("memberListSearchTerm", sort.keyword);
              sessionStorage.setItem("memberListPage", sort.page);
            },
          })}
          dataSource={data}
          onChange={onChange}
          style={{ borderTop: `2px solid ${color.mainBlue}` }}
          showSorterTooltip={false}
          pagination={{
            total,
            pageSize: 10,
            showSizeChanger: false,
            current: sort.page,
          }}
          rowSelection={rowSelection}
          scroll={{ x: 1700 }}
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"No Data"}
              />
            ),
          }}
        />
      </WhiteBoxLayout>
      {Object.values(customer).findIndex((item) => item.show === 1) !== -1 && (
        <BannerWrapper hasHeight={true}>
          {Object.values(customer)
            .filter((item) => item.show === 1)
            .map((item, index) => {
              return (
                <BannerImg
                  src={item.image}
                  alt="banner"
                  onClick={() => window.open(item.link)}
                  key={index}
                  style={{
                    backgroundColor: color.caption,
                    cursor: "pointer",
                  }}
                />
              );
            })}
        </BannerWrapper>
      )}

      <CreateMemberModal
        open={createMemberModal}
        setCreateMemberModal={setCreateMemberModal}
      />
    </LoggedInLayout>
  );
};

export default Member;
