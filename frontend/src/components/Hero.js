import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#ff6b35' : 'transparent'};
  color: ${props => props.$primary ? 'white' : 'white'};
  border: ${props => props.$primary ? 'none' : '2px solid white'};
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 1.1rem;

  &:hover {
    background: ${props => props.$primary ? '#e55a2b' : 'rgba(255,255,255,0.1)'};
    transform: translateY(-2px);
  }
`;

const HeroFeatures = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1.2rem;
  }
`;

const Hero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          PDF'lerle çalışmanız için ihtiyacınız olan her araç tek yerde
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          PDF'leri birleştirin, bölün, sıkıştırın, dönüştürün, döndürün, kilidini açın ve filigran ekleyin. Hepsi birkaç tıklamayla!
        </HeroSubtitle>
        
        <HeroButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button $primary>PDF Yükleyin</Button>
          <Button>İş Akışı Oluşturun</Button>
        </HeroButtons>
        
        <HeroFeatures
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <FeatureItem>
            <i className="fas fa-shield-alt"></i>
            <span>Güvenli Bağlantı HTTPS</span>
          </FeatureItem>
          <FeatureItem>
            <i className="fas fa-lock"></i>
            <span>ISO27001 Sertifikalı</span>
          </FeatureItem>
          <FeatureItem>
            <i className="fas fa-file-pdf"></i>
            <span>PDF Derneği</span>
          </FeatureItem>
        </HeroFeatures>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
