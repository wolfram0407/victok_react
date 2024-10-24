import styled from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { numberValueGetter } from "../../../../../utils/utils";

const Container = styled.div`
  width: ${(p) => (p.width ? p.width : "100%")};
  border: 0.1rem solid ${color.border};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  padding: 3rem 2rem;
`;

const Image = styled.img`
  width: 6.4rem;
  height: 6.4rem;
  object-fit: cover;
  border-radius: 1rem;
  margin-right: 1.6rem;
`;

const Wrapper = styled.div``;

const DividerLine = styled.div`
  width: 0.1rem;
  height: 2rem;
  background-color: ${color.grey};
  margin: 0 0.6rem;
`;

const InfoCard = ({ width, color, image, title, body, multi }) => {
  return (
    <Container width={width}>
      <Image src={image} />
      <Wrapper>
        <TextAtom fontSize={"1.6rem"} fontWeight="bold" color={color}>
          {title}
        </TextAtom>
        {multi ? (
          <RowWrapper>
            <TextAtom fontSize={"2.2rem"} fontWeight="bold">
              {`총 ${numberValueGetter(body?.message_cnt ?? "0", " 건")} `}
            </TextAtom>
            <DividerLine
              style={{ marginRight: "0.2rem", marginLeft: "1rem" }}
            />
            <DividerLine style={{ marginLeft: 0, marginRight: "1rem" }} />
            <TextAtom fontSize={"2rem"} fontWeight={600}>
              {`단문 ${numberValueGetter(body?.sms_cnt ?? "0", " 건")} `}
            </TextAtom>
            <DividerLine />
            <TextAtom fontSize={"2rem"} fontWeight={600}>
              {`장문 ${numberValueGetter(body?.lms_cnt ?? "0", " 건")} `}
            </TextAtom>
            <DividerLine />
            <TextAtom fontSize={"2rem"} fontWeight={600}>
              {`포토 ${numberValueGetter(body?.mms_cnt ?? "0", " 건")} `}
            </TextAtom>
          </RowWrapper>
        ) : (
          <TextAtom fontSize={"2.2rem"} fontWeight="bold">
            {body}
          </TextAtom>
        )}
      </Wrapper>
    </Container>
  );
};

export default InfoCard;
