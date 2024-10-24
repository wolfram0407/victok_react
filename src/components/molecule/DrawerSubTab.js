import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { color } from "../../styles/theme";
import TextAtom from "../atom/TextAtom";

const Container = styled.div`
  width: 100%;
  height: 3.4rem;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: ${(p) => (p.icon ? "2.4rem" : "5.4rem")};
  background-color: ${(p) => (p.isCurrentPage ? color.white : "transparent")};
  cursor: pointer;
`;

const FocusedLabel = styled.div`
  width: 0.6rem;
  height: 100%;
  position: absolute;
  left: 0;
  background-color: ${color.gold};
`;

const IconWrapper = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DrawerSubTab = ({ name, path, icon, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClickSubTab = () => navigate(path);

  const sanitizedPath = path.includes("?") ? path.split("?")[0] : path;

  const isCurrentPage =
    sanitizedPath === "/"
      ? location.pathname === "/" || location.pathname.includes("storeDetail")
        ? true
        : false
      : location.pathname.includes(sanitizedPath);

  return (
    <Container
      onClick={onClick ? onClick : onClickSubTab}
      isCurrentPage={isCurrentPage}
      icon={icon}
    >
      {isCurrentPage && <FocusedLabel />}
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <TextAtom
        fontSize={"1.5rem"}
        fontWeight="500"
        marginLeft={icon ? "1.4rem" : 0}
        color={isCurrentPage ? color.black : color.white}
      >
        {name}
      </TextAtom>
    </Container>
  );
};

export default DrawerSubTab;
