import styled from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { CloseOutlined } from "@ant-design/icons";

const Container = styled.div`
  display: flex;
  padding: 1rem;
  border: 0.1rem solid ${color.border};
  align-items: center;
  justify-content: space-between;
  border-radius: 0.4rem;
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  word-break: keep-all;
  white-space: nowrap;
`;

const CustomDivider = styled.div`
  width: 0.1rem;
  height: 1rem;
  background-color: ${color.border};
  margin: 0 0.6rem;
`;

const PhonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 9rem;
`;
const SelectedMemberItem = ({ name, phone, onClickDelete }) => {
  return (
    <Container>
      <RowWrapper marginRight={"1rem"}>
        <NameWrapper>
          <TextAtom fontSize={"1.4rem"}>{name ?? "-"}</TextAtom>
        </NameWrapper>
        <CustomDivider />
        <PhonWrapper>
          <TextAtom fontSize={"1.4rem"}>{phone ?? "-"}</TextAtom>
        </PhonWrapper>
      </RowWrapper>
      <CloseOutlined
        onClick={onClickDelete ?? null}
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          color: color.red,
          cursor: "pointer",
        }}
      />
    </Container>
  );
};

export default SelectedMemberItem;
