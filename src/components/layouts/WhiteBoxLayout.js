import styled from "styled-components";
import { color } from "../../styles/theme";

const MonthlyBox = styled.div`
  width: 100%;
  padding: ${(p) => (p.padding ? p.padding : "3.4rem 8rem")};
  background-color: ${color.white};
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
  border-radius: 1rem;
  ${(p) => p.styles}
`;

const WhiteBoxLayout = ({ children, marginBottom, padding, styles }) => {
  return (
    <MonthlyBox marginBottom={marginBottom} padding={padding} styles={styles}>
      {children}
    </MonthlyBox>
  );
};

export default WhiteBoxLayout;
