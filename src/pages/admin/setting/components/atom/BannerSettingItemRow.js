import styled, { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";

const LabelWrapper = styled.div`
  width: 12rem;
`;

const BannerSettingItemRow = ({ title, marginBottom, alignTop, children }) => {
  return (
    <RowWrapper
      marginBottom={marginBottom}
      styles={css`
        width: 100%;
        align-items: ${alignTop ? "flex-start" : "center"};
      `}
    >
      <LabelWrapper>
        <TextAtom
          fontSize={"1.5rem"}
          fontWeight={500}
          styles={css`
            white-space: pre-wrap;
          `}
        >
          {title}
        </TextAtom>
      </LabelWrapper>
      {children}
    </RowWrapper>
  );
};

export default BannerSettingItemRow;
