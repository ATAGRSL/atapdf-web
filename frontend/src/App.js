import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolCard from './components/ToolCard';
import ToolModal from './components/ToolModal';
import Toast from './components/Toast';
import { healthCheck } from './services/api';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const ToolsSection = styled.section`
  padding: 3rem 0;
  background: white;
`;

const ToolsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const ToolsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  padding: 3rem 0 1rem;
  text-align: center;
`;

const tools = [
  {
    id: 1,
    name: 'PDF Birleştir',
    description: 'PDF\'leri istediğiniz sırayla birleştirin. En kolay PDF birleştirici mevcut.',
    category: 'organize',
    operation: 'merge'
  },
  {
    id: 2,
    name: 'PDF Böl',
    description: 'Bir sayfayı veya tüm seti bağımsız PDF dosyalarına dönüştürün.',
    category: 'organize',
    operation: 'split'
  },
  {
    id: 3,
    name: 'PDF Sıkıştır',
    description: 'Maksimum PDF kalitesini koruyarak dosya boyutunu küçültün.',
    category: 'optimize',
    operation: 'compress'
  },
  {
    id: 4,
    name: 'Filigran Ekle',
    description: 'PDF\'inizin üzerine saniyeler içinde resim veya metin damgası vurun.',
    category: 'edit',
    operation: 'watermark'
  },
  {
    id: 5,
    name: 'PDF Kilidini Aç',
    description: 'PDF parola güvenliğini kaldırarak PDF\'lerinizi istediğiniz gibi kullanın.',
    category: 'security',
    operation: 'unlock'
  },
  {
    id: 6,
    name: 'PDF\'den Word\'e',
    description: 'PDF dosyalarınızı düzenlenebilir Word belgelerine dönüştürün.',
    category: 'convert',
    operation: 'pdf-to-word'
  },
  {
    id: 7,
    name: 'Word\'den PDF\'e',
    description: 'Word belgelerinizi PDF formatına dönüştürün.',
    category: 'convert',
    operation: 'word-to-pdf'
  }
];

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...toast, id }]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const checkBackendHealth = useCallback(async () => {
    try {
      const status = await healthCheck();
      setBackendStatus(status);
      showToast({
        type: 'success',
        title: 'Bağlantı Başarılı',
        message: 'ATAPDF backend servisi çalışıyor'
      });
    } catch (error) {
      setBackendStatus(null);
      showToast({
        type: 'error',
        title: 'Bağlantı Hatası',
        message: 'Backend servisine bağlanılamıyor. Lütfen backend sunucusunu başlatın.'
      });
    }
  }, [showToast]);

  useEffect(() => {
    // Check backend health on app start
    checkBackendHealth();
  }, [checkBackendHealth]);

  const handleToolClick = (tool) => {
    if (!backendStatus) {
      showToast({
        type: 'warning',
        title: 'Servis Dışı',
        message: 'Backend servisi çalışmıyor. Lütfen önce backend\'i başlatın.'
      });
      return;
    }
    
    setSelectedTool(tool);
  };

  const handleModalClose = () => {
    setSelectedTool(null);
  };

  return (
    <AppContainer>
      <Header />
      <Hero />
      
      <ToolsSection>
        <ToolsContainer>
          <SectionTitle>Tüm PDF Araçları</SectionTitle>
          <ToolsGrid
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={handleToolClick}
              />
            ))}
          </ToolsGrid>
        </ToolsContainer>
      </ToolsSection>
      
      <Footer>
        <p>&copy; 2025 ATAPDF - PDF Editörünüz</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Backend Status: {backendStatus ? '�� Çalışıyor' : '🔴 Çalışmıyor'}
        </p>
      </Footer>
      
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={handleModalClose}
          onShowToast={showToast}
        />
      )}
      
      <Toast toasts={toasts} removeToast={removeToast} />
    </AppContainer>
  );
}

export default App;
