import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Question, QuestionsContextTypes, UsersContextTypes } from '../../types';
import QuestionsContext from '../contexts/QuestionsContext';
import UsersContext from '../contexts/UsersContext';
import AnswersContext from '../contexts/AnswersContext';

import AddAnswer from '../UI/organisms/AddAnswer';
import AnswerCard from '../UI/molecules/AnswerCard';

const Wrapper = styled.div`
  padding: 2rem 1rem;
  color: white;
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionCard = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #1a1a1a;
  margin-bottom: 2rem;
  display: flex;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 1rem;
`;

const Body = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const VoteColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
`;

const CircleButton = styled.button`
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: white;

  &:hover {
    background-color: #f5c518;
    color: #181818;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    font-size: 16px;
  }
`;

const Score = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin: 6px 0;
`;

const Error = styled.p`
  color: #f56262;
  font-weight: bold;
`;

const TextLink = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  margin-right: 1rem;
  color: #f5c518;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #e2b33c;
    text-decoration: none;
  }
`;

const DeleteTextButton = styled.button`
  display: inline-block;
  margin-top: 1.5rem;
  color: #f56262;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #d84343;
    text-decoration: none;
  }
`;

const DeleteWarning = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  color: #f56262;
  font-size: 14px;
`;

const ConfirmButtons = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const DangerButton = styled.button`
  background-color: #f56262;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #d84343;
  }
`;

const CancelButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #666;
  }
`;

const SpecificQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getQuestionById,
    deleteQuestion,
    likeQuestion,
    dislikeQuestion
  } = useContext(QuestionsContext) as QuestionsContextTypes;

  const { decodeFromToken, loggedInUser } = useContext(UsersContext) as UsersContextTypes;
  const { answers, getAnswersByQuestionId } = useContext(AnswersContext);

  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const decodedUser = decodeFromToken();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const questionRes = await getQuestionById(id);
      if ('error' in questionRes) {
        setError(questionRes.error);
        return;
      }

      setQuestion(questionRes.question);
      await getAnswersByQuestionId(id);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInitialDelete = () => {
    const hasAnswers = true;
    if (hasAnswers) {
      setShowDeleteConfirm(true);
    } else {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    if (!question) return;
    const res = await deleteQuestion(question._id);
    if ('success' in res) {
      setDeleteMessage('Question deleted successfully.');
      setTimeout(() => navigate('/questions'), 1800);
    } else {
      setDeleteError(res.error || 'Failed to delete question');
    }
  };

  const handleLike = async () => {
    if (!question?._id) return;
    const result = await likeQuestion(question._id);
    if (result.updatedQuestion) {
      setQuestion(result.updatedQuestion);
    }
  };

  const handleDislike = async () => {
    if (!question?._id) return;
    const result = await dislikeQuestion(question._id);
    if (result.updatedQuestion) {
      setQuestion(result.updatedQuestion);
    }
  };

  if (error) {
    return (
      <Wrapper>
        <Error>{error}</Error>
      </Wrapper>
    );
  }

  if (!question) {
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <QuestionCard>
        <VoteColumn>
          <CircleButton onClick={handleLike} disabled={!loggedInUser}>
            <KeyboardArrowUpIcon />
          </CircleButton>
          <Score>{question.likes.length - question.dislikes.length}</Score>
          <CircleButton onClick={handleDislike} disabled={!loggedInUser}>
            <KeyboardArrowDownIcon />
          </CircleButton>
        </VoteColumn>
        <Content>
          <Title>{question.title}</Title>
          <Meta>
            Asked by <strong>{question.author.username}</strong> •{' '}
            {new Date(question.createdAt).toLocaleString()}
          </Meta>
          <Body>{question.description}</Body>

          {decodedUser && question.author && decodedUser._id === question.author._id && (
            <>
              <TextLink to={`/questions/${question._id}/edit`}>Edit question</TextLink>
              <DeleteTextButton onClick={handleInitialDelete}>Delete question</DeleteTextButton>
            </>
          )}

          {showDeleteConfirm && (
            <DeleteWarning>
              <p>
                <strong>Delete this answered question?</strong><br />
                We do not recommend deleting questions with answers because doing so deprives future readers of this knowledge.
                Are you sure you wish to delete?
              </p>
              <ConfirmButtons>
                <DangerButton onClick={handleDelete}>Delete Question</DangerButton>
                <CancelButton onClick={() => setShowDeleteConfirm(false)}>Cancel</CancelButton>
              </ConfirmButtons>
            </DeleteWarning>
          )}

          {deleteError && <p style={{ color: '#f56262', marginTop: '1rem' }}>{deleteError}</p>}
          {deleteMessage && <p style={{ color: '#f5c518', marginTop: '1rem' }}>{deleteMessage}</p>}
        </Content>
      </QuestionCard>

      {answers.map(answer => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
      <AddAnswer />
    </Wrapper>
  );
};

export default SpecificQuestion;