import styled from "styled-components";

const Container = styled.div`
  width: ${(p) => (p.width ? p.width : "50rem")};
  ${(p) => p.styles}
`;

const SettingSectionBox = ({ children, width, styles }) => {
  return (
    <Container width={width} styles={styles}>
      {children}
    </Container>
  );
};

export default SettingSectionBox;
