import { forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
  margin-right: ${(p) => (p.marginRight ? p.marginRight : 0)};
  padding-left: ${(p) => (p.paddingLeft ? p.paddingLeft : 0)};
  ${(p) => p.styles}
`;

const RowWrapper = (
  { children, marginBottom, marginRight, paddingLeft, styles },
  ref
) => {
  return (
    <Container
      ref={ref}
      marginBottom={marginBottom}
      marginRight={marginRight}
      paddingLeft={paddingLeft}
      styles={styles}
    >
      {children}
    </Container>
  );
};

export default forwardRef(RowWrapper);
