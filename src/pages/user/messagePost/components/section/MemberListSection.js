import { css } from "styled-components";
import { AutoComplete, Empty, Select, Table } from "antd";
import SimpleToggleHeader from "../atom/SimpleToggleHeader";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { useEffect, useState } from "react";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";
import BasicTag from "../../../../../components/atom/BasicTag";
import BasicButton from "../../../../../components/atom/BasicButton";
import { useCallback } from "react";
import messageMemberTableColum from "../column/messageMemberTableColum";
import { API } from "../../../../../utils/api";
import { useQuery } from "react-query";
import { useRef } from "react";

const { Option } = Select;

const MemberListSection = ({
  setTagGroup,
  tagGroup,
  selectedMembers,
  setSelectedMembers,
  selectedTags,
  setSelectedTags,
  sort,
  setSort,
}) => {
  const [isMore, setIsMore] = useState(true);

  const [members, setMembers] = useState({
    data: [],
    total: 0,
  });

  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [selectedGroupTagList, setSelectedGroupTagList] = useState([]);
  const tagRef = useRef();

  useQuery(
    "messageTags",
    async () => await API.get("/tag/tag-type-all").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        setTagList(data);
      },
    }
  );

  const { refetch: getAllMemberRefetch, isLoading } = useQuery(
    "allMemberData",
    () =>
      API.get("/locker/customer-list", {
        params: {
          keyword: sort.keyword,
          page: sort.page,
          amount: sort.amount,
          need_refuse_list: 1,
          ...(sort.column && { column: sort.column }),
          ...(sort.order && { order: sort.order }),
          ...(selectedTags.length > 0 && {
            tag_idxs: selectedTags.map((tag) => tag.idx).join(","),
          }),
        },
      }),
    {
      onSuccess: ({ data }) => {
        const result = data.list.map((item) => ({
          ...item,
          key: item.idx,
          use: item.count > 0 ? "O" : "X",
        }));
        setMembers((prev) => ({
          ...prev,
          data: result,
          total: data.total,
        }));
      },
    }
  );

  const onClickScroll = (scrollOffset) =>
    (tagRef.current.scrollLeft += scrollOffset);

  const onClickTag = (value) => {
    if (sort.keyword.includes(value)) return;
    if (selectedTags.find((item) => item === value)) {
      onUnSelectTag(value);
      return;
    }
    setSelectedTags((prev) => [...prev, value]);
  };
  const onUnSelectTag = (value) => {
    const index = selectedTags.findIndex((item) => item.idx === value.idx);
    setSelectedTags((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const onSelectChange = (_, row) => {
    setSelectedMembers(row);
  };
  const rowSelection = {
    selectedRowKeys: selectedMembers.map((member) => member.idx),
    onChange: onSelectChange,
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setSort((prev) => ({
      ...prev,
      page: pagination.current,
    }));
    if (extra.order) {
      setSort((prev) => ({
        ...prev,
        column: extra.field,
        order: extra.order === "ascend" ? "ASC" : "DESC",
      }));
    } else {
      setSort((prev) => ({ ...prev, column: null, order: null }));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getAllMemberRefetch();
    }, 500);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [sort, selectedTags]);

  useEffect(() => {
    if (!tagGroup) return;
    if (parseInt(tagGroup) === 0) {
      const allTags = tagList
        .map((group) => ({
          ...group,
          tags: group.tags.map((tag) => ({
            ...tag,
            is_default: group.name === "기본" ? 1 : 0,
          })),
        }))
        .map((group) => group.tags.filter((tag) => tag.idx !== null));
      let allTagsList = [];
      for (let i of allTags) {
        allTagsList.push(...i);
      }
      setSelectedGroupTagList(allTagsList);
    } else {
      const selectedTagGroup = tagList.find((group) => group.idx === tagGroup);
      const selectedTagGroupTags = selectedTagGroup.tags.map((tag) => ({
        ...tag,
        is_default: selectedTagGroup.name === "기본" ? 1 : 0,
      }));
      setSelectedGroupTagList(selectedTagGroupTags);
    }
  }, [tagList, tagGroup]);
  return (
    <>
      <SimpleToggleHeader
        titleComponent={
          <RowWrapper>
            <TextAtom fontSize={"1.8rem"} fontWeight={600} marginRight="0.6rem">
              회원 선택
            </TextAtom>
            <TextAtom fontSize={"1.4rem"} marginRight="2rem">
              ( 총
              <span style={{ color: color.gold, margin: "0 0.4rem" }}>
                {numberToLocaleString(members.total)}
              </span>
              명 )
            </TextAtom>
            <TextAtom fontSize={"1.2rem"} color={color.red}>
              ※ 중복된 전화번호는 1건만 전송됩니다.
            </TextAtom>
          </RowWrapper>
        }
        isMore={isMore}
        toggleMore={() => setIsMore((prev) => !prev)}
      />
      {isMore && (
        <>
          <RowWrapper
            styles={css`
              width: 100%;
              justify-content: space-between;
            `}
            marginBottom="1rem"
          >
            <RowWrapper
              styles={css`
                width: calc(100% - 30rem);
              `}
            >
              <Select
                placeholder="구분"
                onChange={(e) => setTagGroup(e)}
                value={tagGroup}
                style={{ width: "9rem", marginRight: "0.6rem" }}
              >
                {[{ idx: "00", name: "전체" }, ...tagList]
                  .map((group) => ({ idx: group.idx, name: group.name }))
                  .filter((item) => item.idx !== null)
                  .map((item) => (
                    <Option key={item.idx} value={item.idx}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
              <RowWrapper
                styles={css`
                  width: calc(100% - 9.6rem);
                `}
              >
                <BasicButton
                  styles={css`
                    width: 3.2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: ${color.grey};
                  `}
                  marginright="0.6rem"
                  onClick={() => onClickScroll(-40)}
                >{`<`}</BasicButton>
                <RowWrapper
                  ref={tagRef}
                  styles={css`
                    max-width: calc(100% - 6.6rem);
                    overflow-x: scroll;
                  `}
                  marginRight="0.6rem"
                >
                  {[
                    ...selectedTags,
                    ...selectedGroupTagList.filter(
                      (tag) => !selectedTags.includes(tag)
                    ),
                  ].map((item, index) => {
                    const defaultTag = Boolean(item.is_default);
                    return (
                      <BasicTag
                        key={item.idx}
                        onClick={() => onClickTag(item)}
                        styles={css`
                          margin-right: ${index !==
                          selectedGroupTagList.length - 1
                            ? "0.4rem"
                            : 0};
                          background-color: ${selectedTags.findIndex(
                            (tag) => tag.idx === item.idx
                          ) !== -1
                            ? defaultTag
                              ? "#8C8C8C"
                              : color.mainBlue
                            : color.white};
                          color: ${selectedTags.findIndex(
                            (tag) => tag.idx === item.idx
                          ) !== -1
                            ? color.white
                            : color.black};
                          border-color: ${selectedTags.findIndex(
                            (tag) => tag.idx === item.idx
                          ) !== -1
                            ? defaultTag
                              ? "#8C8C8C"
                              : "#162D59"
                            : defaultTag
                            ? "#D9D9D9"
                            : "#162D59"};
                          cursor: pointer;
                        `}
                        // closable={
                        //   selectedTags.findIndex(
                        //     (tag) => tag.idx === item.idx
                        //   ) !== -1
                        // }
                        // onClose={() => onUnSelectTag(item)}
                      >
                        {item.name}
                      </BasicTag>
                    );
                  })}
                </RowWrapper>
                <BasicButton
                  styles={css`
                    width: 3.2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: ${color.grey};
                  `}
                  onClick={() => onClickScroll(40)}
                >{`>`}</BasicButton>
              </RowWrapper>
            </RowWrapper>
            <AutoComplete
              style={{ width: 250, marginLeft: "10px" }}
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
                    const memberDataArr = members.data
                      .map((i) => (i[type] ? i[type].split(", ") : []))
                      .filter((i) => i !== null);
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
                    const targetArr = members.data
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
          </RowWrapper>
          <Table
            rowSelection={rowSelection}
            columns={[
              ...messageMemberTableColum(),
              {
                title: "수신거부",
                dataIndex: "refused",
              },
              {
                title: "광고 수신 동의",
                dataIndex: "agree_marketing",
                render: (data) => <span>{data ? "Y" : "N"}</span>,
              },
            ]}
            dataSource={members.data}
            onChange={onChange}
            style={{ borderTop: "2px solid #162D59", width: "100%" }}
            pagination={{
              total: members.total,
              pageSize: 10,
              showSizeChanger: false,
              current: sort.page,
            }}
            showSorterTooltip={false}
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
        </>
      )}
    </>
  );
};

export default MemberListSection;
