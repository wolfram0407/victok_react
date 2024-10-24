import styled from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { HiOutlineTrash } from "react-icons/hi";
import { color } from "../../../../../styles/theme";

const Item = styled.div`
  min-width: 14rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  border: ${(p) => (p.disabled ? `0.2rem solid ${color.border}` : "none")};
  border-radius: 0.2rem;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  background-color: ${(p) => (p.disabled ? "transparent" : color.grey)};
`;

const IconWrapper = styled.div`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.2rem;
  background-color: ${color.mainBlue};
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
`;

const TagGroupItem = ({ name, onDelete, disabled }) => {
  return (
    <Item disabled={disabled}>
      <TextAtom fontSize={"1.2rem"} marginRight="1.6rem">
        {name}
      </TextAtom>
      <IconWrapper
        onClick={() => {
          if (disabled) {
            return;
          }
          onDelete();
        }}
        disabled={disabled}
      >
        <HiOutlineTrash fontSize={16} color={color.white} />
      </IconWrapper>
    </Item>
  );
};

export default TagGroupItem;
