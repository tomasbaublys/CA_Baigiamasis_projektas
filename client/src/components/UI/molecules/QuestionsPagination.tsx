import { useContext } from 'react';
import styled from 'styled-components';
import QuestionsContext from '../../contexts/QuestionsContext.tsx';

const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PaginationButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? '#f5c518' : '#2a2a2a')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  border: 1px solid #444;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 40px;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#e4b709' : '#444')};
  }

  &:disabled {
    background-color: #444;
    cursor: default;
    color: #777;
  }
`;

const Select = styled.select`
  background-color: #2a2a2a;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 8px;

  &:focus {
    outline: none;
    border-color: #f5c518;
  }
`;

const QuestionsPagination = () => {
  const {
    filteredDataAmount,
    pageSize,
    currentPage,
    changePage,
    changePageSize,
  } = useContext(QuestionsContext)!;

  const lastPage =
    filteredDataAmount === 0 ? 1 : Math.ceil(filteredDataAmount / pageSize.current!);

  return (
    <PaginationBar>
      <PaginationButtons>
        {currentPage.current !== 1 && (
          <PageButton onClick={() => changePage(currentPage.current - 1)}>Prev</PageButton>
        )}

        {lastPage <= 3 ? (
          Array.from({ length: lastPage }, (_, i) => (
            <PageButton
              key={i + 1}
              $active={currentPage.current === i + 1}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))
        ) : (
          <>
            <PageButton
              $active={currentPage.current === 1}
              onClick={() => changePage(1)}
            >
              1
            </PageButton>

            {currentPage.current > 3 && <PageButton disabled>...</PageButton>}

            {currentPage.current > 2 && currentPage.current < lastPage && (
              <PageButton onClick={() => changePage(currentPage.current - 1)}>
                {currentPage.current - 1}
              </PageButton>
            )}

            {currentPage.current !== 1 && currentPage.current !== lastPage && (
              <PageButton $active disabled>
                {currentPage.current}
              </PageButton>
            )}

            {currentPage.current < lastPage - 1 && currentPage.current > 1 && (
              <PageButton onClick={() => changePage(currentPage.current + 1)}>
                {currentPage.current + 1}
              </PageButton>
            )}

            {currentPage.current < lastPage - 2 && <PageButton disabled>...</PageButton>}

            <PageButton
              $active={currentPage.current === lastPage}
              onClick={() => changePage(lastPage)}
            >
              {lastPage}
            </PageButton>
          </>
        )}

        {currentPage.current !== lastPage && (
          <PageButton onClick={() => changePage(currentPage.current + 1)}>Next</PageButton>
        )}
      </PaginationButtons>

      <div>
        {filteredDataAmount
          ? (currentPage.current - 1) * pageSize.current! + 1
          : 0}{' '}
        –{' '}
        {currentPage.current * pageSize.current! > filteredDataAmount
          ? filteredDataAmount
          : currentPage.current * pageSize.current!}{' '}
        of {filteredDataAmount}
      </div>

      <div>
        Show per page:{' '}
        <Select
          value={pageSize.current}
          onChange={(e) => changePageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </Select>
      </div>
    </PaginationBar>
  );
};

export default QuestionsPagination;