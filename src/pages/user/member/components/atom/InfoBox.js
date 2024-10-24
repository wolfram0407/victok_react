import styled, { css } from "styled-components";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";

const Box = styled.div`
  border: 1px solid ${color.border};
  position: absolute;
  right: 2.4rem;
  top: 0;
  z-index: 10;
  background-color: ${color.white};
  border-radius: 0.4rem;
  padding: 0.4rem;
`;

const InfoBox = () => {
  return (
    <Box>
      <TextAtom
        fontSize={"0.8rem"}
        styles={css`
          white-space: pre-wrap;
        `}
      >
        {`특정 부류의 고객에게만 메시지를 보내고 싶을 경우
해당 고객들을 그룹화 해주는 역할입니다.
ex) ABC클럽, 시대표, VIP회원, 라카요금미납자`}
      </TextAtom>
    </Box>
  );
};

export default InfoBox;
