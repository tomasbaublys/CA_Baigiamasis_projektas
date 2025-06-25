import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #121212;
  color: #bbb;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.85rem;
  margin-top: auto;
`;

const FooterLinks = styled.div`
  margin-top: 0.5rem;
  a {
    color: #f5c518;
    margin: 0 0.5rem;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #bbb;
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <div>© {new Date().getFullYear()} Movies Forum • All rights reserved.</div>
      <div>Discuss. Review. Explore the world of cinema together.</div>
      <div>Contact us: support@moviesforum.com</div>
      <FooterLinks>
        <a href="#">Help</a>
        <a href="#">Community Guidelines</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
      </FooterLinks>
    </FooterWrapper>
  );
};

export default Footer;