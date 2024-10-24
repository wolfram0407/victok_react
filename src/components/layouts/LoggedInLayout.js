import styled from "styled-components";
import { color } from "../../styles/theme";
import { useAppContext } from "../../utils/context";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-width: 134.2rem;
  padding: 0 8rem;
  padding-bottom: ${(p) => (p.paddingBottom ? p.paddingBottom : "2.4rem")};
  background-color: ${(p) => (p.admin ? color.white : color.bg)};
  padding-top: ${(p) => (p.paddingTop ? p.paddingTop : "5rem")};
  ${(p) => p.styles}
`;

const LoggedInLayout = ({ children, paddingBottom, styles, paddingTop }) => {
  const { isAdmin } = useAppContext();

  return (
    <Container
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      admin={isAdmin}
      styles={styles}
    >
      {children}
    </Container>
  );
};

export default LoggedInLayout;
