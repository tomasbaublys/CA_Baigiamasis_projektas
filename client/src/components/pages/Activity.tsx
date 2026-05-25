import styled from 'styled-components';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import QuestionsContext from '../../components/contexts/QuestionsContext.tsx';
import UsersContext from '../../components/contexts/UsersContext.tsx';
import type { Question } from '../../types';
import Person from '@mui/icons-material/Person';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import TagList from '../UI/molecules/TagList';

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

  svg {
    vertical-align: middle;
    margin-right: 4px;
  }
`;

const Author = styled.span``;
const CreatedAt = styled.span``;

const Message = styled.p`
  color: white;
  text-align: center;
  font-size: 1rem;
`;

const Activity = () => {
  const { questions, loading, fetchQuestions } = useContext(QuestionsContext)!;
  const { loggedInUser } = useContext(UsersContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userQuestions = questions.filter(q => q.author._id === loggedInUser?._id);

  return (
    <PageWrapper>
      <Title>Your Questions ({userQuestions.length})</Title>
      {loading ? (
        <Message>Loading your questions...</Message>
      ) : userQuestions.length > 0 ? (
        <QuestionList>
          {userQuestions.map((question: Question) => (
            <QuestionCard key={question._id}>
              <QuestionTitle>
                <Link to={`/questions/${question._id}`}>{question.title}</Link>
              </QuestionTitle>
              <Description>{question.description}</Description>
              <TagList tags={question.tags} />
              <Meta>
                <Author>
                  <Person fontSize="small" />
                  {question.author.username}
                </Author>
                <span>
                  <QuestionAnswer fontSize="small" />
                  {question.answersCount ?? 0} answers
                </span>
                <CreatedAt>{new Date(question.createdAt).toLocaleDateString()}</CreatedAt>
              </Meta>
            </QuestionCard>
          ))}
        </QuestionList>
      ) : (
        <Message>You haven't asked any questions yet.</Message>
      )}
    </PageWrapper>
  );
};

export default Activity;
