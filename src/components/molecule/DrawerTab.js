import styled from "styled-components";
import TextAtom from "../atom/TextAtom";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { color } from "../../styles/theme";
import { useState } from "react";
import DrawalSubTab from "./DrawerSubTab";

const Container = styled.div`
  width: 100%;
`;

const MainTab = styled.div`
  width: 100%;
  padding: 1.2rem 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RightSection = styled.div``;

const DrawerTab = ({ icon, name, sub }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Container>
      <MainTab onClick={() => setIsOpen((prev) => !prev)}>
        <LeftSection>
          <IconWrapper>{icon}</IconWrapper>
          <TextAtom
            fontSize={"1.6rem"}
            fontWeight="bold"
            marginLeft={"1.4rem"}
            color={color.white}
          >
            {name}
          </TextAtom>
        </LeftSection>
        <RightSection>
          {isOpen ? (
            <IoChevronUpOutline size={14} color={color.white} />
          ) : (
            <IoChevronDownOutline size={14} color={color.white} />
          )}
        </RightSection>
      </MainTab>
      {isOpen &&
        sub.map((item, index) => <DrawalSubTab key={item.id} {...item} />)}
    </Container>
  );
};

export default DrawerTab;
