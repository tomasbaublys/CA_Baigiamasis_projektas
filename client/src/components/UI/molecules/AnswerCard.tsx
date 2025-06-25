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
  max-width: 85%;
  margin-left: auto;
`;

const MetaLine = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 0.5rem;

  span.username {
    color: #f5c518;
    font-weight: bold;
  }

  span.edited {
    font-size: 0.8rem;
    color: #999;
    margin-left: 0.4rem;
  }
`;

const Content = styled.p`
  color: #fff;
  margin-top: 0.5rem;
  white-space: pre-wrap;
`;

const EditLink = styled.span`
  color: #f5c518;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const DeleteLink = styled.span`
  color: #f56262;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
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
  gap: 0.75rem;
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
      <MetaLine>
        Answered by <span className="username">{answer.username}</span> · {formattedDate}
        {answer.edited && <span className="edited">(edited)</span>}
      </MetaLine>

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
              <EditLink onClick={() => setIsEditing(true)}>Edit answer</EditLink>
              <DeleteLink onClick={() => setShowConfirm(true)}>Delete answer</DeleteLink>
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