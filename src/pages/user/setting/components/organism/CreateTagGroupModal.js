import { Divider, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import TagGroupItem from "../atom/TagGroupItem";

const CreateTagGroupModal = ({
  open,
  onCancel,
  tagGroupList,
  tagGroupMaxLength,
  onSaveTagGroup,
  setMaxLengthError,
  setDeleteTargetIdxs,
}) => {
  const [tagGroupInput, setTagGroupInput] = useState("");
  const [modalGroupList, setModalGroupList] = useState([]);

  const onClickAdd = () => {
    if (tagGroupInput === "") {
      return;
    }
    if (modalGroupList.length < tagGroupMaxLength) {
      setModalGroupList((prev) => [...prev, { name: tagGroupInput }]);
      setTagGroupInput("");
    } else {
      setMaxLengthError({
        isError: true,
        type: "group",
      });
    }
  };

  const onClickDelete = (tag, index) => {
    if (tag.tags && tag.tags.length > 0) {
      Modal.error({
        title: <span style={{ color: color.red }}>구분 삭제 불가</span>,
        content: `‘${tag.name}’에 저장된 태그가 있을 경우 삭제가 불가합니다.`,
      });
    } else {
      Modal.confirm({
        title: "구분 삭제",
        content: `‘${tag.name}’ 구분을 삭제하시겠습니까?`,
        okText: "삭제",
        onOk: () => {
          if (tag.idx) {
            if (
              modalGroupList.filter((item) => item === tag.idx).length === 0
            ) {
              setDeleteTargetIdxs((prev) => [...prev, tag.idx]);
            }
          }
          setModalGroupList(
            modalGroupList.filter((group) => group.name !== tag.name)
          );
        },
        cancelText: "취소",
      });
    }
  };

  const onClickSave = () => {
    onSaveTagGroup(modalGroupList);
  };

  useEffect(() => {
    setModalGroupList(tagGroupList);
    // eslint-disable-next-line
  }, [open]);

  return (
    <Modal
      open={open}
      title={`구분 추가`}
      onCancel={onCancel}
      footer={[]}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "2rem" }} />
      <RowWrapper marginBottom={"1rem"}>
        <Input
          value={tagGroupInput}
          onChange={(e) => setTagGroupInput(e.target.value)}
          style={{ marginRight: "1rem" }}
          placeholder="구분명을 입력해주세요."
          maxLength={10}
        />
        <BasicButton focused onClick={onClickAdd}>
          추가
        </BasicButton>
      </RowWrapper>

      <RowWrapper
        styles={css`
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 1.6rem;
          row-gap: 0.6rem;
        `}
        marginBottom="1rem"
      >
        {modalGroupList.map((item, index) => (
          <TagGroupItem
            key={index}
            name={item.name}
            onDelete={() => onClickDelete(item, index)}
            disabled={item.name === "기본"}
          />
        ))}
      </RowWrapper>
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
          태그 구분은 태그를 보다 체계적으로 관리하기 위해 나누는 것으로, 이는
          태그로 생성되는 것이 아니오니 착오 없으시기 바랍니다.
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

export default CreateTagGroupModal;
