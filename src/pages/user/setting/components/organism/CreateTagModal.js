import { Divider, Input, Modal, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import BasicTag from "../../../../../components/atom/BasicTag";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { specialSymbolReg } from "../../../../../utils/utils";

const { Option } = Select;

const CreateTagModal = ({
  open,
  onCancel,
  tagGroupList,
  setCreateTagError,
  maxTagLength,
  setMaxLengthError,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("기본");
  const [tagInput, setTagInput] = useState("");
  const [tagInputError, setTagInputError] = useState(false);
  const [existError, setExistError] = useState("");
  const [tagList, setTagList] = useState([]);
  const [groupIdx, setGroupIdx] = useState(null);
  const [deleteIdxs, setDeleteIdxs] = useState([]);
  const [addedTags, setAddedTags] = useState([]);

  useQuery(
    ["tagTypeData", selectedCategory],
    async () => {
      if (!selectedCategory) return;
      return await API.get("/tag/tag-type-all", {
        params: {
          type_idx: tagGroupList.find((item) => item.name === selectedCategory)
            .idx,
        },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        const idx = tagGroupList.find(
          (item) => item.name === selectedCategory
        ).idx;
        if (data[idx]) {
          const group = data[idx];
          setGroupIdx(group.idx);
          setTagList(group.tags);
        }
      },
      enabled: open,
    }
  );

  const onChangeSelect = (value) => {
    if (tagInput) {
      setTagInput("");
    }
    setSelectedCategory(value);
  };

  const checkTagMutation = useMutation(
    async (data) => await API.post("/tag/tag-not-dup", data)
  );

  const onClickAdd = () => {
    checkTagMutation
      .mutateAsync({ name: tagInput })
      .then((res) => {
        console.log(res.data);
        if (res.data.ok) {
          if (addedTags.length >= maxTagLength) {
            setMaxLengthError({
              isError: true,
              type: "tag",
            });
          } else {
            if (selectedCategory === "" || tagInput === "") {
              return;
            }
            if (specialSymbolReg.test(tagInput)) {
              setTagInputError(true);
              return;
            }
            setTagList((prev) => [
              ...prev.filter((exist) => exist.name !== tagInput),
              { name: tagInput },
            ]);
            setAddedTags((prev) => [
              ...prev.filter((exist) => exist.name !== tagInput),
              { name: tagInput },
            ]);
          }
        }
      })
      .catch((e) => {
        setExistError(e.response.data.message);
      });

    setTagInput("");
  };

  const onClickDelete = (tag) => {
    if (tag.idx) {
      setDeleteIdxs((prev) => [
        ...prev.filter((exist) => exist !== tag.idx),
        tag.idx,
      ]);
      setTagList(tagList.filter((exist) => exist.idx !== tag.idx));
    } else {
      setAddedTags(addedTags.filter((exist) => exist.name !== tag.name));
      setTagList(tagList.filter((exist) => exist.name !== tag.name));
    }
  };

  const createTagMutation = useMutation(
    async (data) => {
      let newTags = [];
      for (let tag of data) {
        const formData = {
          name: tag.name,
          tag_type_idx: groupIdx,
        };
        await API.post("/tag/tag", formData).then((res) => {
          return newTags.push({ name: tag.name, idx: res.data.idx });
        });
      }
      return newTags;
    },
    {
      onSuccess: (data) => {
        queryClient.fetchQuery("tagTypeData");
        setAddedTags([]);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message === "이미 사용중인 태그명입니다.") {
            setCreateTagError(true);
          }
          console.log(error.response);
          setAddedTags([]);
        } else {
          console.log(error);
          setAddedTags([]);
        }
      },
    }
  );

  const onClickDeleteMutation = useMutation(
    async (data) => {
      for (let idx of data) {
        await API.post("tag/tag-delete", { idx });
      }
    },
    {
      onSuccess: () => {
        queryClient.fetchQuery("tagTypeData");
        setDeleteIdxs([]);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
          setDeleteIdxs([]);
        } else {
          console.log(error);
          setDeleteIdxs([]);
        }
      },
    }
  );
  const onClickSave = () => {
    if (deleteIdxs.length === 0 && addedTags.length === 0) {
      onCancel();
    } else {
      if (deleteIdxs.length > 0) {
        onClickDeleteMutation.mutate(deleteIdxs);
      }
      if (addedTags.length > 0) {
        createTagMutation.mutate(addedTags);
      }
      onCancel();
    }
  };

  useEffect(() => {
    setSelectedCategory("기본");
    setTagList([]);
    // eslint-disable-next-line
  }, [open]);

  return (
    <Modal
      open={open}
      title={`태그 추가`}
      onCancel={() => {
        setAddedTags([]);
        onCancel();
      }}
      footer={[]}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "2rem" }} />
      <RowWrapper
        styles={css`
          gap: 1rem;
          align-items: flex-start;
        `}
        marginBottom={"1rem"}
      >
        <Select
          placeholder={"구분"}
          value={selectedCategory}
          onChange={(e) => onChangeSelect(e)}
          style={{ minWidth: "14rem" }}
        >
          {tagGroupList.map(({ name, idx }) => (
            <Option key={idx ? idx : name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
        <RowWrapper
          styles={css`
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          `}
        >
          <Input
            value={tagInput}
            onChange={(e) => {
              if (setTagInputError) {
                setTagInputError(false);
              }
              if (setExistError) {
                setExistError(false);
              }
              setTagInput(e.target.value);
            }}
            placeholder="태그명을 입력해주세요."
            maxLength={10}
            disabled={selectedCategory === "기본"}
          />
          {selectedCategory === "기본" && (
            <TextAtom fontSize={"1.4rem"} color={color.red} marginTop="0.2rem">
              기본 태그는 추가가 불가합니다.
            </TextAtom>
          )}
          {tagInputError === true && (
            <TextAtom fontSize={"1.4rem"} color={color.red} marginTop="0.2rem">
              특수 문자 및 공백은 사용할 수 업습니다.
            </TextAtom>
          )}
          {Boolean(existError) && (
            <TextAtom fontSize={"1.4rem"} color={color.red} marginTop="0.2rem">
              {existError}
            </TextAtom>
          )}
        </RowWrapper>
        <BasicButton
          focused
          onClick={onClickAdd}
          disabled={selectedCategory === "기본" || tagInputError}
        >
          추가
        </BasicButton>
      </RowWrapper>
      {tagList.length !== 0 && (
        <RowWrapper
          styles={css`
            flex-wrap: wrap;
            gap: 0.6rem;
          `}
          marginBottom="1rem"
        >
          {tagList.map((tag, index) => (
            <BasicTag
              key={index}
              closable={selectedCategory !== "기본"}
              onClose={() => onClickDelete(tag)}
            >
              {tag.name}
            </BasicTag>
          ))}
        </RowWrapper>
      )}
      <RowWrapper
        styles={css`
          align-items: flex-start;
        `}
        marginBottom="1.6rem"
      >
        <TextAtom fontSize={"1.2rem"} color={color.red} marginRight="0.4rem">
          ※
        </TextAtom>
        <TextAtom fontSize={"1.2rem"}>
          한 번 생성된 태그의 명칭 변경은 불가하며 삭제 후 다시 추가해야 하니
          태그명을 신중히 작성해주세요.
        </TextAtom>
      </RowWrapper>
      <BasicButton
        size={"large"}
        focused
        styles={css`
          width: 100%;
        `}
        onClick={onClickSave}
      >
        저장
      </BasicButton>
    </Modal>
  );
};

export default CreateTagModal;
