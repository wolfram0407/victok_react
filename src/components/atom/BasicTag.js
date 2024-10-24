import { CloseOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import styled from "styled-components";
import { color } from "../../styles/theme";

const CustomTag = styled(Tag)`
  display: flex;
  align-items: center;
  height: 2.8rem;
  color: ${(p) => (p.closable ? color.mainBlue : color.darkGrey)};
  border-color: ${(p) => (p.closable ? color.mainBlue : color.grey)};
  border-radius: 1.8rem;
  background-color: ${color.white};
  margin: 0;
  ${(p) => p.styles}

  cursor: ${(p) => (p.onClick ? "pointer" : "auto")};
`;

const BasicTag = ({ children, closable, onClose, styles, onClick }) => {
  return (
    <CustomTag
      closable={closable}
      onClose={onClose ?? null}
      closeIcon={
        <CloseOutlined
          style={{ color: color.red }}
          onClick={(e) => {
            e.stopPropagation();
            if (!onClose) {
              return;
            }
            onClose();
          }}
        />
      }
      styles={styles}
      onClick={onClick ?? null}
    >
      {children}
    </CustomTag>
  );
};

export default BasicTag;
