import styled from 'styled-components';
import { useContext } from 'react';
import { Link } from 'react-router'; // ✅ Added this line
import QuestionsContext from '../../components/contexts/QuestionsContext.tsx';
import type { Question } from '../../types';

// Styled-components (top of file for clarity and structure)
const Wrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #f5c518;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f5c518;
  padding-bottom: 0.5rem;
`;

const Message = styled.p`
  text-align: center;
  color: #ccc;
  font-size: 1rem;
`;

const QuestionCard = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const QuestionTitle = styled.h3`
  color: #f5c518;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;

  a {
    color: #f5c518;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Description = styled.p`
  color: #ddd;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-top: 0.75rem;
  color: #999;
`;

const Author = styled.span``;
const CreatedAt = styled.span``;

// Component
const Questions = () => {
  const context = useContext(QuestionsContext);

  if (!context) {
    return <Message>Questions context is not available.</Message>;
  }

  const { questions, loading } = context;

  if (loading) return <Message>Loading questions...</Message>;

  return (
    <Wrapper>
      <Title>All Questions</Title>
      {questions.length === 0 ? (
        <Message>No questions found.</Message>
      ) : (
        questions.map((question: Question) => (
          <QuestionCard key={question._id}>
            <QuestionTitle>
              <Link to={`/questions/${question._id}`}>{question.title}</Link>
            </QuestionTitle>
            <Description>{question.description}</Description>
            <Meta>
              <Author>👤 {question.author.username}</Author>
              <CreatedAt>{new Date(question.createdAt).toLocaleDateString()}</CreatedAt>
            </Meta>
          </QuestionCard>
        ))
      )}
    </Wrapper>
  );
};

export default Questions;