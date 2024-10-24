import { Button } from "antd";
import styled, { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";

const Container = styled.div`
  width: 40rem;
  height: 46rem;
  padding: 4rem 4.2rem 0 4.2rem;
  border: 0.2rem solid ${(p) => p.borderColor};
  border-radius: 1rem;
`;

const Image = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  object-fit: cover;
`;

const InfoItem = ({ type, body, marginBottom }) => {
  return (
    <RowWrapper marginBottom={marginBottom}>
      {type === "free" && (
        <Image
          src={require("../../../../../assets/images/checkMain.png")}
          alt="x"
        />
      )}
      {type === "basic" && (
        <Image
          src={require("../../../../../assets/images/checkGold.png")}
          alt="x"
        />
      )}
      <TextAtom fontSize={"1.5rem"} fontWeight={400}>
        {body}
      </TextAtom>
    </RowWrapper>
  );
};

const GoodsInfoBox = ({
  list,
  type,
  title,
  price,
  priceComponent,
  payload,
  btnTitle,
  onClick,
}) => {
  return (
    <Container borderColor={type === "free" ? color.mainBlue : color.gold}>
      <RowWrapper
        styles={css`
          flex-direction: column;
        `}
      >
        <TextAtom
          fontSize={"3.6rem"}
          fontWeight="bold"
          color={type === "free" ? color.mainBlue : color.gold}
          marginBottom="1.2rem"
        >
          {title}
        </TextAtom>
        {priceComponent ? (
          priceComponent
        ) : (
          <TextAtom fontSize={"2.2rem"} fontWeight={600} marginBottom="2rem">
            {price}원
          </TextAtom>
        )}

        <TextAtom
          fontSize={"1.6rem"}
          styles={css`
            white-space: pre-wrap;
            text-align: center;
          `}
          marginBottom="1.6rem"
        >
          {payload}
        </TextAtom>
        <Button
          size="large"
          style={{
            width: "100%",
            borderRadius: "5rem",
            backgroundColor: type === "free" ? color.mainBlue : color.gold,
            color: color.white,
            height: "4.8rem",
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
          onClick={onClick ?? null}
        >
          {btnTitle}
        </Button>
      </RowWrapper>
      {list.map((item, index) => (
        <InfoItem
          key={item.id}
          body={item.body}
          type={type}
          marginBottom={index !== list.length - 1 ? "0.6rem" : 0}
        />
      ))}
    </Container>
  );
};

export default GoodsInfoBox;
