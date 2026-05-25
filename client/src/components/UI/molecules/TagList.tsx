import styled from 'styled-components';
import { Link } from 'react-router';

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.75rem;
`;

const tagStyles = `
  display: inline-flex;
  align-items: center;
  max-width: 160px;
  min-height: 24px;
  padding: 3px 9px;
  border: 1px solid #4a3d12;
  border-radius: 999px;
  background-color: #2b250f;
  color: #f5c518;
  font-size: 0.78rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-decoration: none;
`;

const Tag = styled.span`
  ${tagStyles}
`;

const TagLink = styled(Link)`
  ${tagStyles}

  &:hover {
    background-color: #3a3115;
    border-color: #f5c518;
    color: #ffe58a;
  }
`;

const EmptyTags = styled.span`
  color: #777;
  font-size: 0.85rem;
`;

type Props = {
  tags?: string[];
  linkTags?: boolean;
};

const TagList = ({ tags = [], linkTags = true }: Props) => {
  const cleanTags = tags.filter(Boolean);

  if (!cleanTags.length) {
    return (
      <Tags>
        <EmptyTags>No tags</EmptyTags>
      </Tags>
    );
  }

  return (
    <Tags aria-label="Question tags">
      {cleanTags.map((tag) =>
        linkTags ? (
          <TagLink key={tag} to={`/questions?tag=${encodeURIComponent(tag)}`}>
            {tag}
          </TagLink>
        ) : (
          <Tag key={tag}>{tag}</Tag>
        )
      )}
    </Tags>
  );
};

export default TagList;
