import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  h1 {
    color: #ff6b35;
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
  }
`;

const MainNav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
    
    &:hover {
      color: #ff6b35;
    }
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    
    &.mobile-active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    ul {
      flex-direction: column;
      padding: 1rem 0;
    }

    li {
      text-align: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#ff6b35' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#333'};
  border: ${props => props.$primary ? 'none' : '1px solid #ddd'};
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.$primary ? '#e55a2b' : '#f8f9fa'};
    border-color: ${props => props.$primary ? '#ff6b35' : '#ff6b35'};
    color: ${props => props.$primary ? 'white' : '#ff6b35'};
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ATAPDF
          </motion.h1>
        </Logo>
        
        <MainNav className={isMobileMenuOpen ? 'mobile-active' : ''}>
          <ul>
            <li><a href="#tools">Tüm PDF Araçları</a></li>
            <li><a href="#workflows">İş Akışları</a></li>
          </ul>
        </MainNav>
        
        <HeaderActions>
          <Button>Giriş Yap</Button>
          <Button $primary>Kayıt Ol</Button>
          <MobileMenuBtn onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '×' : '☰'}
          </MobileMenuBtn>
        </HeaderActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
