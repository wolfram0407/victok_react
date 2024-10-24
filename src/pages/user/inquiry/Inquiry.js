import styled, { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import TextAtom from "../../../components/atom/TextAtom";
import Footer from "../../../components/Footer";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import { color } from "../../../styles/theme";
import { useAppContext } from "../../../utils/context";

const IconImage = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  object-fit: cover;
  margin: 0 2rem 0 0.8rem;
`;

const Inquiry = () => {
  const { termList } = useAppContext();

  const btnList = [
    {
      id: 1,
      body: "자주 하는 질문",
      image: require("../../../assets/images/faqIcon.png"),
      onClick: () =>
        window.open(
          termList.find((term) => term.title.toLowerCase() === "faq").url
        ),
    },
    {
      id: 2,
      body: "1:1 채팅 상담",
      image: require("../../../assets/images/chatIcon.png"),
      onClick: () =>
        window.open(
          termList.find((term) => term.title.toLowerCase() === "channeltalk")
            .url
        ),
    },
    {
      id: 3,
      body: "문의 전화 : 010 - 5688 - 2432",
      image: require("../../../assets/images/phoneIcon.png"),
    },
  ];
  return (
    <LoggedInLayout
      styles={css`
        padding: 0;
        padding-top: 5rem;
        justify-content: space-between;
      `}
    >
      <WhiteBoxLayout
        styles={css`
          width: 70rem;
          padding: 5rem 8rem;
          margin-left: 8rem;
        `}
      >
        <TextAtom fontSize={"2.2rem"} fontWeight="bold" marginBottom={"0.6rem"}>
          문의
        </TextAtom>
        <TextAtom fontSize={"1.4rem"} marginBottom="3.6rem">
          궁금한 점이 있으시면 친절하게 상담해 드립니다.
        </TextAtom>
        {btnList.map((item, index) => (
          <BasicButton
            key={item.id}
            size={"large"}
            marginbottom="1.2rem"
            onClick={() => (item.onClick ? item.onClick() : null)}
            styles={css`
              width: 100%;
              min-height: 6rem;
              display: flex;
              align-items: center;
              color: ${color.mainBlue};
              font-weight: 500;
              border: ${index !== btnList.length - 1
                ? `1px solid ${color.mainBlue}`
                : `none`};

              background-color: ${index !== btnList.length - 1
                ? "transparent"
                : color.brightGrey};
              cursor: ${item.onClick ? "pointer" : "auto"};
            `}
          >
            <IconImage src={item.image} alt="x" /> {item.body}
          </BasicButton>
        ))}
      </WhiteBoxLayout>
      <Footer />
    </LoggedInLayout>
  );
};

export default Inquiry;
