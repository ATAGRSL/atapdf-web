import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: #ff6b35;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ToolIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #ff6b35;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const ToolTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const ToolDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const NewBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff6b35;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const CardWrapper = styled.div`
  position: relative;
`;

const ToolCard = ({ tool, onClick }) => {
  const getIconClass = (toolName) => {
    const iconMap = {
      'PDF Birleştir': 'fas fa-object-group',
      'PDF Böl': 'fas fa-cut',
      'PDF Sıkıştır': 'fas fa-compress',
      'PDF\'den Word\'e': 'fas fa-file-word',
      'PDF\'den PowerPoint\'e': 'fas fa-file-powerpoint',
      'PDF\'den Excel\'e': 'fas fa-file-excel',
      'PDF\'den JPG\'ye': 'fas fa-file-image',
      'Word\'den PDF\'e': 'fas fa-file-pdf',
      'PDF Düzenle': 'fas fa-edit',
      'PDF Döndür': 'fas fa-rotate',
      'PDF Kilidini Aç': 'fas fa-unlock',
      'PDF Korumala': 'fas fa-lock',
      'PDF İmzalama': 'fas fa-signature',
      'Filigran Ekle': 'fas fa-tint',
      'PDF Karşılaştır': 'fas fa-newspaper',
      'PDF Redakte Et': 'fas fa-eye-slash',
      'Sayfa Numarası Ekle': 'fas fa-list-ol',
      'PDF Kırp': 'fas fa-crop',
      'OCR PDF': 'fas fa-search',
      'PDF\'den PDF/A\'ya': 'fas fa-file-pdf'
    };
    return iconMap[tool.name] || 'fas fa-file-pdf';
  };

  return (
    <CardWrapper>
      <Card
        onClick={() => onClick(tool)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <ToolIcon>
          <i className={getIconClass(tool.name)}></i>
        </ToolIcon>
        <ToolTitle>{tool.name}</ToolTitle>
        <ToolDescription>{tool.description}</ToolDescription>
      </Card>
      {tool.isNew && <NewBadge>Yeni!</NewBadge>}
    </CardWrapper>
  );
};

export default ToolCard;
