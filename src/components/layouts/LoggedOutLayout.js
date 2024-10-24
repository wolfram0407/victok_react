import styled from "styled-components";
import { color } from "../../styles/theme";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${color.bg};
  ${(p) => p.styles}
`;

const Box = styled.div`
  display: flex;
  min-width: 55rem;
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : "flex-start")};
  justify-content: center;
  padding: 6rem;
  background-color: ${color.white};
  border-radius: 1rem;
`;

const LoggedOutLayout = ({ children, center, styles }) => {
  return (
    <Container styles={styles}>
      <Box center={center}>{children}</Box>
    </Container>
  );
};

export default LoggedOutLayout;
