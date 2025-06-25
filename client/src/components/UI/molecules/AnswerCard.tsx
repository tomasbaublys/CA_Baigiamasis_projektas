import styled from 'styled-components';
import { Answer } from '../../../types';

const AnswerWrapper = styled.div`
  background-color: #1f1f1f;
  padding: 1rem;
  border: 1px solid #333;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Username = styled.p`
  font-weight: bold;
  color: #f5c518;
  margin-bottom: 0.3rem;
`;

const DateText = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`;

const Content = styled.p`
  color: #fff;
  margin-top: 0.5rem;
`;

const EditedBadge = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-left: 0.5rem;
`;

const AnswerCard = ({ answer }: { answer: Answer }) => {
  const formattedDate = new Date(answer.createdAt).toLocaleString();

  return (
    <AnswerWrapper>
      <Username>
        {answer.username} <DateText>{formattedDate}</DateText>
        {answer.edited && <EditedBadge>(edited)</EditedBadge>}
      </Username>
      <Content>{answer.content}</Content>
    </AnswerWrapper>
  );
};

export default AnswerCard;