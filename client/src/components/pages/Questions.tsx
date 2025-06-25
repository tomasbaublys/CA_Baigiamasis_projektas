import styled from 'styled-components';
import { useContext, useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import QuestionsContext from '../../components/contexts/QuestionsContext.tsx';
import QuestionFilter from '../UI/molecules/QuestionFilter';
import QuestionSort from '../UI/molecules/QuestionSort';
import QuestionsPagination from '../UI/molecules/QuestionsPagination';
import type { Question } from '../../types';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  color: white;
  margin-bottom: 2rem;
  text-align: center;
`;

const PageLayout = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #1c1c1c;
  padding: 1rem;
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    position: static;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

const QuestionList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const QuestionCard = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1rem;
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

const Message = styled.p`
  color: white;
  text-align: center;
  font-size: 1rem;
`;

const Questions = () => {
  const location = useLocation();
  const { questions, loading, fetchQuestions } = useContext(QuestionsContext)!;

  useEffect(() => {
    if (location.pathname === '/questions') {
      fetchQuestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <PageWrapper>
      <Title>All Questions ({questions.length})</Title>
      <PageLayout>
        <Sidebar>
          <h3>Filter</h3>
          <QuestionFilter />
          <hr style={{ margin: '1rem 0', borderColor: '#333' }} />
          <h3>Sort</h3>
          <QuestionSort />
        </Sidebar>

        <MainContent>
          {loading ? (
            <Message>Loading questions...</Message>
          ) : questions.length > 0 ? (
            <>
              <QuestionList>
                {questions.map((question: Question) => (
                  <QuestionCard key={question._id}>
                    <QuestionTitle>
                      <Link to={`/questions/${question._id}`}>{question.title}</Link>
                    </QuestionTitle>
                    <Description>{question.description}</Description>
                    <Meta>
                      <Author>👤 {question.author.username}</Author>
                      <span>💬 {question.answersCount ?? 0} answers</span>
                      <CreatedAt>{new Date(question.createdAt).toLocaleDateString()}</CreatedAt>
                    </Meta>
                  </QuestionCard>
                ))}
              </QuestionList>
              <QuestionsPagination />
            </>
          ) : (
            <Message>No questions found...</Message>
          )}
        </MainContent>
      </PageLayout>
    </PageWrapper>
  );
};

export default Questions;
