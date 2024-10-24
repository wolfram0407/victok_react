import { css } from "styled-components";
import { useState } from "react";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";
import SimpleToggleHeader from "../atom/SimpleToggleHeader";
import BoxLayout from "../atom/BoxLayout";
import SelectedMemberItem from "../organism/SelectedMemberItem";

const SelectedMemberSection = ({ selectedMembers, setSelectedMembers }) => {
  const [isMore, setIsMore] = useState(true);
  const onClickReset = () => {
    if (selectedMembers.length === 0) {
      return;
    }
    setSelectedMembers([]);
  };
  return (
    <>
      <SimpleToggleHeader
        titleComponent={
          <RowWrapper>
            <TextAtom fontSize={"1.8rem"} fontWeight={600} marginRight="0.6rem">
              선택된 회원
            </TextAtom>
            <TextAtom fontSize={"1.4rem"} marginRight="2rem">
              (
              <span style={{ color: color.gold, margin: "0 0.4rem" }}>
                {numberToLocaleString(selectedMembers.length)}
              </span>
              명 )
            </TextAtom>
          </RowWrapper>
        }
        btnComponent={
          <RowWrapper>
            <BasicButton
              focused={selectedMembers.length !== 0}
              onClick={onClickReset}
              marginright="1.6rem"
            >
              초기화
            </BasicButton>
            <BasicButton onClick={() => setIsMore((prev) => !prev)}>
              {isMore ? "접기" : "펼치기"}
            </BasicButton>
          </RowWrapper>
        }
        isMore={isMore}
      />
      {isMore && (
        <BoxLayout
          styles={css`
            padding: 1rem;
            min-height: 9rem;
            justify-content: ${selectedMembers.length === 0
              ? "center"
              : "flex-start"};
            align-items: ${selectedMembers.length === 0
              ? "center"
              : "flex-start"};
            border-width: 0.2rem;
            gap: 0.6rem 1.6rem;
            flex-wrap: wrap;
          `}
        >
          {selectedMembers.length !== 0 ? (
            selectedMembers.map(({ idx, name, phone }) => {
              return (
                <SelectedMemberItem
                  key={idx}
                  name={name}
                  phone={phone}
                  onClickDelete={() =>
                    setSelectedMembers(
                      selectedMembers.filter((member) => member.name !== name)
                    )
                  }
                />
              );
            })
          ) : (
            <TextAtom fontSize={"1.4rem"} color={color.caption}>
              선택된 회원이 없습니다.
            </TextAtom>
          )}
        </BoxLayout>
      )}
    </>
  );
};

export default SelectedMemberSection;
