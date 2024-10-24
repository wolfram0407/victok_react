import styled, { css } from "styled-components";
import { color } from "../../styles/theme";
import TextAtom from "../atom/TextAtom";

const Container = styled.div`
  width: 60rem;
`;

const AdminSettingLayout = ({
  title,
  caption,
  captionMarginBottom,
  children,
}) => {
  return (
    <Container>
      <TextAtom
        fontSize={"2.4rem"}
        fontWeight="bold"
        color={color.mainBlue}
        marginBottom="2.4rem"
      >
        {title}
      </TextAtom>
      <TextAtom
        fontSize={"1.6rem"}
        marginBottom={captionMarginBottom}
        styles={css`
          white-space: pre-wrap;
        `}
      >
        {caption}
      </TextAtom>
      {children}
    </Container>
  );
};

export default AdminSettingLayout;
