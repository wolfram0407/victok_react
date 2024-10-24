import { Empty, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import SettingSectionBox from "../atom/SettingSectionBox";
import tagListTableColumn from "../column/tagListTableColumn";
import CreateTagGroupModal from "../organism/CreateTagGroupModal";
import CreateTagModal from "../organism/CreateTagModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import AdModalContent from "../../../../../components/organism/AdModalContent";

const TagSection = () => {
  const { grade } = useOutletContext();
  const [focusedTagGroup, setFocusedTagGroup] = useState("All");
  const [tagGroupList, setTagGroupList] = useState([]);
  const [createTagGroupModal, setCreateTagGroupModal] = useState(false);
  const [createTagModal, setCreateTagModal] = useState(false);
  const [createTagError, setCreateTagError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState({
    isError: false,
    type: "",
  });
  const [totalTags, setTotalTags] = useState([]);
  const [allGroupTags, setAllGroupTags] = useState([]);
  const [selectedTypeTags, setSelectedTypeTags] = useState([]);
  const [deleteTargetIdxs, setDeleteTargetIdxs] = useState([]);
  const tagGroupMaxLength = 5;
  const tagMaxLength = 50;

  const navigate = useNavigate();

  const { isLoading: tagsLoading } = useQuery(
    "tagTypeData",
    async () => await API.get("/tag/tag-type-all").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data.length) return;

        setTagGroupList(
          data.map((group) => ({
            idx: group.idx,
            name: group.name,
            tags: group.tags,
          }))
        );
        let tags = [],
          allGroupTags = [];
        for (let group of data) {
          tags.push({
            ...group,
            key: group.idx,
            tags: group.tags.map((tag) => ({ ...tag, key: tag.idx })),
          });
          if (group.name !== "기본") {
            allGroupTags.push(
              ...group.tags.map((tag) => ({ ...tag, key: tag.idx }))
            );
          }
        }
        setTotalTags(tags);
        setAllGroupTags(allGroupTags);
        setSelectedTypeTags(
          focusedTagGroup === "All"
            ? tags
            : tags.filter((group) => group.idx === focusedTagGroup)
        );
      },
    }
  );

  const onClickTab = (value) => {
    if (focusedTagGroup === value.idx) {
      return;
    }
    setFocusedTagGroup(value.idx);
    if (value.idx === "All") {
      setSelectedTypeTags(totalTags);
      return;
    }
    setSelectedTypeTags(totalTags.filter((group) => group.idx === value.idx));
  };

  const deleteTagGroupMutation = useMutation(
    (data) => API.post("/tag/tag-type-delete", data).then(() => data),
    {
      onSuccess: (data) => {
        queryClient.fetchQuery("tagTypeData");
        setDeleteTargetIdxs(deleteTargetIdxs.filter((idx) => idx !== data.idx));
      },
    }
  );

  const createTagTypeMutation = useMutation(
    async (data) =>
      await API.post("/tag/tag-type", data).then((res) => ({
        resData: res.data,
        data,
      })),
    {
      onSuccess: ({ resData, data }) => {
        setCreateTagGroupModal(false);
        queryClient.fetchQuery("tagTypeData");
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onSaveTagGroup = (list) => {
    const exceptDefault = list.filter((item) => !item.idx);
    if (deleteTargetIdxs.length > 0) {
      try {
        for (let idx of deleteTargetIdxs) {
          deleteTagGroupMutation.mutate({ idx });
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (exceptDefault.length === 0) return setCreateTagGroupModal(false);
    try {
      for (let tag of exceptDefault) {
        createTagTypeMutation.mutate({ name: tag.name });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteTagMutation = useMutation(
    async (data) =>
      await API.post("/tag/tag-delete", { idx: data.idx }).then(() => data),
    {
      onSuccess: (data) => {
        queryClient.fetchQuery("tagTypeData");
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onDeleteTag = (row, idx) => {
    deleteTagMutation.mutate({ idx, row });
  };

  useEffect(() => {
    if (createTagError) {
      Modal.error({
        title: "태그 추가 실패",
        content: "이미 사용중인 태그명입니다.",
        okText: "확인",
        onOk: () => setCreateTagError(false),
      });
    }
  }, [createTagError]);

  useEffect(() => {
    if (maxLengthError.isError) {
      Modal.error({
        title: `${maxLengthError.type === "group" ? "구분" : "태그"} 추가 불가`,
        content:
          maxLengthError.type === "group"
            ? "구분은 최대 5개까지만 등록 가능합니다."
            : "태그는 최대 50개까지 추가 가능합니다.",
        okText: "확인",
        onOk: () =>
          setMaxLengthError({
            isError: false,
            type: "",
          }),
      });
    }
  }, [maxLengthError]);

  return (
    <SettingSectionBox width={"100%"}>
      <RowWrapper
        marginBottom={"2.4rem"}
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
      >
        <RowWrapper>
          <TextAtom fontSize={"2rem"} fontWeight={600} marginRight="0.6rem">
            태그 관리
          </TextAtom>
          <TextAtom fontSize={"1.6rem"} fontWeight={500}>
            {`( ${totalTags.length}/${tagGroupMaxLength} )`}
          </TextAtom>
        </RowWrapper>
        <BasicButton
          styles={css`
            border-color: ${color.mainBlue};
            color: ${color.mainBlue};
          `}
          onClick={() => {
            if (grade === 0) {
              Modal.confirm({
                title: "태그 구분 추가 불가",
                content:
                  "태그 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
                okText: "구매하기",
                onOk: () => navigate("/goodsInfo"),
                cancelText: "취소",
              });
            } else {
              setCreateTagGroupModal(true);
            }
          }}
        >
          + 구분 추가
        </BasicButton>
      </RowWrapper>
      <RowWrapper
        styles={css`
          gap: 0.6rem;
        `}
        marginBottom="4rem"
      >
        <BasicButton
          focused={focusedTagGroup === "All"}
          onClick={() => onClickTab({ name: "All", idx: "All" })}
        >
          전체
        </BasicButton>
        {tagGroupList.map((item, index) => (
          <BasicButton
            key={index}
            focused={focusedTagGroup === item.idx}
            onClick={() => onClickTab(item)}
          >
            {item.name}
          </BasicButton>
        ))}
      </RowWrapper>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
        `}
        marginBottom="1rem"
      >
        <RowWrapper>
          <TextAtom fontSize={"1.6rem"} fontWeight={600} marginRight="0.6rem">
            {`( ${allGroupTags.length} / ${tagMaxLength} )`}
          </TextAtom>
          <TextAtom fontSize={"1.2rem"} fontWeight={500} color={color.caption}>
            기본 태그는 카운트에 포함되지 않습니다.
          </TextAtom>
        </RowWrapper>
        <BasicButton
          focused
          onClick={() => {
            if (grade === 0) {
              Modal.confirm({
                title: "태그 추가 불가",
                content:
                  "태그 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
                okText: "구매하기",
                onOk: () => navigate("/goodsInfo"),
                cancelText: "취소",
              });
            } else {
              if (allGroupTags.length > 49) {
                setMaxLengthError({
                  isError: true,
                  type: "tag",
                });
              } else {
                setCreateTagModal(true);
              }
            }
          }}
        >
          + 태그 추가
        </BasicButton>
      </RowWrapper>
      <Table
        columns={tagListTableColumn({ onDeleteTag })}
        dataSource={selectedTypeTags}
        style={{ borderTop: `2px solid ${color.mainBlue}` }}
        showSorterTooltip={false}
        loading={tagsLoading}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"No Data"}
            />
          ),
        }}
      />
      <TextAtom
        fontSize={"1.6rem"}
        color={color.mainBlue}
        styles={css`
          text-decoration: underline;
          cursor: pointer;
        `}
        onClick={() =>
          window.open("https://blog.naver.com/victok2023/223066474379")
        }
      >
        태그 관리 이용법
      </TextAtom>
      <CreateTagGroupModal
        open={createTagGroupModal}
        onCancel={() => setCreateTagGroupModal(false)}
        tagGroupList={tagGroupList}
        tagGroupMaxLength={tagGroupMaxLength}
        onSaveTagGroup={onSaveTagGroup}
        setMaxLengthError={setMaxLengthError}
        setDeleteTargetIdxs={setDeleteTargetIdxs}
      />
      <CreateTagModal
        open={createTagModal}
        onCancel={() => setCreateTagModal(false)}
        tagGroupList={tagGroupList}
        tagList={[]}
        setCreateTagError={setCreateTagError}
        maxTagLength={50 - allGroupTags.length}
        setMaxLengthError={setMaxLengthError}
      />
    </SettingSectionBox>
  );
};

export default TagSection;
