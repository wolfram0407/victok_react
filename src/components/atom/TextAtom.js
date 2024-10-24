import { forwardRef } from "react";
import styled, { css } from "styled-components";
import { color } from "../../styles/theme";

const Text = styled.div`
  font-size: ${(p) => (p.fontSize ? p.fontSize : "1.6rem")};
  font-weight: ${(p) => (p.fontWeight ? p.fontWeight : "nomal")};
  ${(p) => p.fontStyle};
  color: ${(p) => (p.color ? p.color : color.black)};
  margin-top: ${(p) => (p.marginTop ? p.marginTop : 0)};
  margin-bottom: ${(p) => (p.marginBottom ? p.marginBottom : 0)};
  margin-right: ${(p) => (p.marginRight ? p.marginRight : 0)};
  margin-left: ${(p) => (p.marginLeft ? p.marginLeft : 0)};
  line-height: 150%;
  letter-spacing: -0.02rem;
  user-select: none;
  ${(p) =>
    p.ellipsis &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: ${(p) => (p.ellipsisNum ? p.ellipsisNum : 1)};
      -webkit-box-orient: vertical;
      word-break: break-word;
    `}
  ${(p) => p.styles};
`;

const TextAtom = (
  {
    children,
    color,
    ellipsis,
    ellipsisNum,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    styles,
    fontStyle,
    fontSize,
    fontWeight,
    onClick,
  },
  ref
) => {
  return (
    <Text
      ref={ref}
      color={color}
      ellipsis={ellipsis}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginRight={marginRight}
      marginLeft={marginLeft}
      styles={styles}
      fontStyle={fontStyle}
      ellipsisNum={ellipsisNum}
      fontSize={fontSize}
      fontWeight={fontWeight}
      onClick={onClick ?? null}
    >
      {children}
    </Text>
  );
};

export default forwardRef(TextAtom);
