import styled from "styled-components";
import { color } from "../../../../../styles/theme";

const Contianer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(p) => (p.flexDirection ? p.flexDirection : "row")};
  justify-content: ${(p) =>
    p.justifyContent ? p.justifyContent : "flex-start"};
  align-items: ${(p) => (p.alignItems ? p.alignItems : "flex-start")};
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
  padding: 1rem 3rem;
  border: 0.1rem solid ${color.border};
  border-radius: 0.4rem;
  ${(p) => p.styles}
`;

const BoxLayout = ({
  justifyContent,
  alignItems,
  flexDirection,
  children,
  marginBottom,
  styles,
}) => {
  return (
    <Contianer
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      marginBottom={marginBottom}
      styles={styles}
    >
      {children}
    </Contianer>
  );
};

export default BoxLayout;
