import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  padding: 0 1.6rem;
  padding-top: 2.4rem;
  display: ${(p) => (p.focused ? "flex" : "none")};
`;

const ModalLayout = ({ children, focused, onClick }) => {
  return (
    <Container focused={focused} onClick={onClick ?? null}>
      {children}
    </Container>
  );
};

export default ModalLayout;
