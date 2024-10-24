import styled from "styled-components";
import { color } from "../styles/theme";
import { useAppContext } from "../utils/context";

const Container = styled.div`
  width: 100%;
  height: 18rem;
  display: flex;
  padding: 3rem 13%;

  justify-content: space-between;
  align-items: center;
  background-color: ${color.white};
`;
const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;

const Terms = styled.div`
  font-weight: bold;
  font-size: 1.6rem;
  color: ${color.mainBlue};
  cursor: pointer;
`;

const RightSection = styled.div`
  display: flex;
`;

const Payload = styled.div`
  color: ${color.black};
  font-size: 1.4rem;
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
`;

const CopyRight = styled.div`
  display: flex;
  font-size: 1.4rem;
  color: ${color.black};
  font-weight: 200;
  margin: 0;
`;

const SnsIcon = styled.img`
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
  transition: 0.3s ease;
  width: 5rem;
  height: 5rem;
  margin-right: ${(p) => (p.lastOne ? 0 : "1.6rem")};
`;

const snsList = [
  {
    id: 1,
    src: require("../assets/images/sns_insta.png"),
    url: "https://www.instagram.com/victok_v/",
  },
  {
    id: 2,
    src: require("../assets/images/sns_kakao.png"),
    url: "http://pf.kakao.com/_Afxdxfb",
  },
  {
    id: 3,
    src: require("../assets/images/sns_youtube.png"),
    url: "https://www.youtube.com/channel/UCW7vlogsi9zUWwvEhHbaJrg",
  },
  {
    id: 4,
    src: require("../assets/images/sns_blog.png"),
    url: "https://blog.naver.com/victok2023",
  },
];

const Footer = () => {
  const { termList } = useAppContext();

  const onClickSnsBtn = (url) => window.open(url);

  return (
    <Container>
      <LeftSection>
        <Row marginBottom="1.6rem">
          {termList
            .filter((item) => item.title !== "ChannelTalk")
            .map((item, index) => (
              <Terms
                key={item.id}
                style={{
                  marginRight: index === termList.length - 1 ? 0 : "3rem",
                }}
                onClick={() => window.open(item.url)}
              >
                {item.title}
              </Terms>
            ))}
        </Row>
        <Payload marginBottom="0.8rem">
          (주)골드레인 | 대표이사 : 김도현 | 사업자등록번호 : 459-88-01214 |
          통신판매신고번호 : 2019-강원춘천-0043
        </Payload>
        <Payload marginBottom="1.6rem">
          강원도 춘천시 수변공원길 19 101호 | 대표전화 : 033-818-0337
        </Payload>
        <CopyRight>copyright 2022 GOLDLANE All rights reserved.</CopyRight>
      </LeftSection>
      <RightSection>
        {snsList.map((item, index) => (
          <SnsIcon
            key={item.id}
            src={item.src}
            lastOne={index === snsList.length - 1}
            onClick={() => onClickSnsBtn(item.url)}
          />
        ))}
      </RightSection>
    </Container>
  );
};

export default Footer;
