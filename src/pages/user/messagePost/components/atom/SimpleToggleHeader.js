import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";

const SimpleToggleHeader = ({
  title,
  isMore,
  toggleMore,
  titleComponent,
  btnComponent,
}) => {
  return (
    <RowWrapper
      styles={css`
        width: 100%;
        justify-content: space-between;
      `}
      marginBottom={isMore ? "1rem" : 0}
    >
      {titleComponent ? (
        titleComponent
      ) : (
        <TextAtom fontSize={"1.8rem"} fontWeight={600}>
          {title}
        </TextAtom>
      )}
      {btnComponent ? (
        btnComponent
      ) : (
        <BasicButton onClick={toggleMore}>
          {isMore ? "접기" : "펼치기"}
        </BasicButton>
      )}
    </RowWrapper>
  );
};

export default SimpleToggleHeader;
