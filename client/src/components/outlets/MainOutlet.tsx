import { Outlet } from 'react-router';
import styled from 'styled-components';

import Header from "../UI/organisms/Header";
import Footer from "../UI/organisms/Footer";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledMain = styled.main`
  flex: 1;
  padding: 2rem 1rem;
`;

const MainOutlet = () => {
  return (
    <LayoutWrapper>
      <Header />
      <StyledMain>
        <Outlet />
      </StyledMain>
      <Footer />
    </LayoutWrapper>
  );
};

export default MainOutlet;