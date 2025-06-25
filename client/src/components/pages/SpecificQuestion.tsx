import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import styled from 'styled-components';

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

const Error = styled.p`
  color: #f56262;
  font-weight: bold;
`;

const EditButton = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 8px 16px;
  background-color: #f5c518;
  color: #181818;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  margin-right: 1rem;
  &:hover {
    background-color: #e2b33c;
  }
`;

const DeleteButton = styled.button`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 8px 16px;
  background-color: #f56262;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #d84343;
  }
`;

const DeleteWarning = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #f5c518;
  border-radius: 6px;
  color: #f5c518;
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

  const { getQuestionById, deleteQuestion } = useContext(QuestionsContext) as QuestionsContextTypes;
  const { decodeFromToken } = useContext(UsersContext) as UsersContextTypes;

  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const decodedUser = decodeFromToken();

  const { answers, getAnswersByQuestionId } = useContext(AnswersContext);

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
      <Title>{question.title}</Title>
      <Meta>
        Asked by <strong>{question.author.username}</strong> •{' '}
        {new Date(question.createdAt).toLocaleString()}
      </Meta>
      <Body>{question.description}</Body>

      {decodedUser && question.author && decodedUser._id === question.author._id && (
        <>
          <EditButton to={`/questions/${question._id}/edit`}>Edit Question</EditButton>
          <DeleteButton onClick={handleInitialDelete}>Delete Question</DeleteButton>
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

      {answers.map(answer => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
      <AddAnswer />
    </Wrapper>
  );
};

export default SpecificQuestion;