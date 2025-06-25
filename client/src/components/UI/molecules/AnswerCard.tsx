import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Answer, UsersContextTypes, AnswersContextTypes } from '../../../types';
import UsersContext from '../../contexts/UsersContext';
import AnswersContext from '../../contexts/AnswersContext';

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
  white-space: pre-wrap;
`;

const EditedBadge = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-left: 0.5rem;
`;

const EditButton = styled.button`
  margin-top: 0.5rem;
  background-color: transparent;
  border: 1px solid #f5c518;
  color: #f5c518;
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f5c518;
    color: #1f1f1f;
  }
`;

const DeleteButton = styled.button`
  margin-top: 0.5rem;
  background-color: transparent;
  border: 1px solid #f56262;
  color: #f56262;
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f56262;
    color: #1f1f1f;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background-color: #2a2a2a;
  color: white;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 14px;
  resize: vertical;
`;

const ActionButtons = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  padding: 6px 14px;
  background-color: #f5c518;
  color: #181818;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 6px 14px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DeleteWarning = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: 1px solid #f5c518;
  border-radius: 6px;
  color: #f5c518;
  font-size: 14px;
`;

const ConfirmButtons = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const DangerButton = styled.button`
  background-color: #f56262;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d84343;
  }
`;

const AnswerCard = ({ answer }: { answer: Answer }) => {
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;
  const { editAnswer, deleteAnswer } = useContext(AnswersContext) as AnswersContextTypes;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(answer.content);
  const [showConfirm, setShowConfirm] = useState(false);

  const isAuthor = loggedInUser?._id === answer.userId;
  const formattedDate = new Date(answer.createdAt).toLocaleString();

  const handleSave = async () => {
    if (editedContent.trim()) {
      await editAnswer(answer._id, editedContent);
      setIsEditing(false);
    }
  };

  return (
    <AnswerWrapper>
      <Username>
        {answer.username} <DateText>{formattedDate}</DateText>
        {answer.edited && <EditedBadge>(edited)</EditedBadge>}
      </Username>

      {isEditing ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
          />
          <ActionButtons>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
          </ActionButtons>
        </>
      ) : (
        <Content>{answer.content}</Content>
      )}

      {isAuthor && !isEditing && (
        <>
          {!showConfirm ? (
            <ActionButtons>
              <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton>
              <DeleteButton onClick={() => setShowConfirm(true)}>Delete</DeleteButton>
            </ActionButtons>
          ) : (
            <DeleteWarning>
              <p>Delete this answer?</p>
              <ConfirmButtons>
                <DangerButton onClick={() => deleteAnswer(answer._id)}>Delete</DangerButton>
                <CancelButton onClick={() => setShowConfirm(false)}>Cancel</CancelButton>
              </ConfirmButtons>
            </DeleteWarning>
          )}
        </>
      )}
    </AnswerWrapper>
  );
};

export default AnswerCard;