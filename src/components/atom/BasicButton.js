import { Button } from "antd";
import styled, { css } from "styled-components";
import { color } from "../../styles/theme";

const CustomButton = styled(Button)`
  border: ${(p) =>
    JSON.parse(p.focused) ? "none" : `1px solid ${color.border}`};
  border-radius: 0.4rem;
  background-color: ${(p) =>
    JSON.parse(p.focused) ? color.mainBlue : color.white};
  color: ${(p) => (JSON.parse(p.focused) ? color.white : color.black)};
  margin-right: ${(p) => (p.marginright ? p.marginright : 0)};
  margin-bottom: ${(p) => (p.marginbottom ? p.marginbottom : 0)};
  margin-left: ${(p) => (p.marginleft ? p.marginleft : 0)};
  ${(p) =>
    p.disabled &&
    css`
      background: ${color.brightGrey};
      border-color: #d9d9d9;
      box-shadow: none;
      color: rgba(0, 0, 0, 0.25);
      text-shadow: none;
      cursor: not-allowed;
    `}
  ${(p) =>
    p.mode === "vertical" &&
    css`
      height: fit-content;
      width: 3.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.8rem 0;
      > span {
        writing-mode: vertical-rl;
        text-orientation: upright;
        letter-spacing: 0.4rem;
      }
    `}
    ${(p) => p.styles};
`;

const BasicButton = ({
  children,
  focused,
  onClick,
  size,
  marginright,
  marginbottom,
  marginleft,
  disabled,
  mode,
  styles,
  htmlType,
}) => {
  return (
    <CustomButton
      type={focused ? "primary" : null}
      focused={focused ? focused.toString() : "false"}
      onClick={onClick ?? null}
      size={size ? size : "middle"}
      styles={styles}
      disabled={disabled ?? false}
      marginright={marginright}
      marginbottom={marginbottom}
      marginleft={marginleft}
      mode={mode}
      htmlType={htmlType}
    >
      {children}
    </CustomButton>
  );
};

export default BasicButton;
