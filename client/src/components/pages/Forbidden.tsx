import styled from "styled-components";
import type { ReactNode } from "react";

type Props = {
  reason: ReactNode;
};

const Wrapper = styled.div`
  max-width: 600px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: white;
  text-align: center;
  border-radius: 8px;
`;

const Title = styled.h2`
  color: #f5c518;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: #ccc;
  line-height: 1.6;

  a {
    color: #f5c518;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Forbidden = ({ reason }: Props) => {
  return (
    <Wrapper>
      <Title>Access Denied</Title>
      <Message>{reason}</Message>
    </Wrapper>
  );
};

export default Forbidden;