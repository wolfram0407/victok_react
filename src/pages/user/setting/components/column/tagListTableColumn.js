import styled from "styled-components";
import BasicTag from "../../../../../components/atom/BasicTag";

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const tagListTableColumn = ({ onDeleteTag }) => [
  {
    title: "구분",
    dataIndex: "name",
    width: "20%",
  },
  {
    title: "태그",
    dataIndex: "tags",
    width: "80%",
    render: (value, row) => {
      // eslint-disable-next-line
      const isBasic = row.name == "기본";

      return (
        <TagContainer key={row.idx}>
          {value
            .filter((tag) => tag.idx)
            .map((tag) => {
              return (
                <BasicTag
                  closable={!isBasic}
                  onClose={() => onDeleteTag(row, tag.idx)}
                  key={tag.idx}
                >
                  {tag.name}
                </BasicTag>
              );
            })}
        </TagContainer>
      );
    },
  },
];

export default tagListTableColumn;
