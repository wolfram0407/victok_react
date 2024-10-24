import styled from "styled-components";
import RowWrapper from "../atom/RowWrapper";
import TextAtom from "../atom/TextAtom";

const Circle = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border: 1px solid #e3e3e3;
  border-radius: 50%;
  margin-right: 0.6rem;

  background-color: ${(p) => (p.circleColor ? p.circleColor : "transparent")};
`;

const StatusLabel = ({ children, circleColor, marginRight }) => {
  return (
    <RowWrapper marginRight={marginRight}>
      <Circle circleColor={circleColor} />
      <TextAtom fontSize={"1.4rem"} fontWeight={200}>
        {children}
      </TextAtom>
    </RowWrapper>
  );
};

export default StatusLabel;
