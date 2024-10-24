import styled from "styled-components";

const Image = styled.img`
  width: 1.4rem;
  height: 1.4rem;
`;

const TagImage = () => {
  return (
    <Image src={require("../../../../../assets/images/tag.png")} alt="x" />
  );
};

export default TagImage;
