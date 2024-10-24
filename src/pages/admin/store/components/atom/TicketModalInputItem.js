import styled from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";

const Container = styled.div`
  min-width: ${(p) => (p.width ? p.width : "30%")};
  display: flex;
  flex-direction: column;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;

const TicketModalInputItem = ({ label, children, width, marginBottom }) => {
  return (
    <Container width={width} marginBottom={marginBottom}>
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="0.8rem">
        {label}
      </TextAtom>
      {children}
    </Container>
  );
};

export default TicketModalInputItem;
