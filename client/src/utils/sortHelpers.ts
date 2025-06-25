import { Question } from '../types';

export const sortQuestions = (questions: Question[], sortKey: string): Question[] => {
  switch (sortKey) {
    case 'sort_answersCount=1':
      return [...questions].sort((a, b) => {
        const aCount = typeof a.answersCount === 'number' ? a.answersCount : 0;
        const bCount = typeof b.answersCount === 'number' ? b.answersCount : 0;
        return aCount - bCount;
      });
    case 'sort_answersCount=-1':
      return [...questions].sort((a, b) => {
        const aCount = typeof a.answersCount === 'number' ? a.answersCount : 0;
        const bCount = typeof b.answersCount === 'number' ? b.answersCount : 0;
        return bCount - aCount;
      });
    default:
      return questions;
  }
};