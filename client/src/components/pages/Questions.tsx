import { useContext } from 'react';
import QuestionsContext from '../../components/contexts/QuestionsContext.tsx';
import styled from 'styled-components';

const Questions = () => {
  const context = useContext(QuestionsContext);

  if (!context) {
    return <p>Questions context is not available.</p>;
  }

  const { questions, loading } = context;

  if (loading) return <p>Loading questions...</p>;

  return (
    <Wrapper>
      <h2>All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((question) => (
          <QuestionCard key={question._id}>
            <h3>{question.title}</h3>
            <p>{question.description}</p>
            <Meta>
              <span>By: {question.author.username}</span>
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            </Meta>
          </QuestionCard>
        ))
      )}
    </Wrapper>
  );
};

export default Questions;

// Styled-components
const Wrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
`;

const QuestionCard = styled.div`
  border: 1px solid #ccc;
  background: #111;
  color: #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
`;

const Meta = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #bbb;
  display: flex;
  justify-content: space-between;
`;