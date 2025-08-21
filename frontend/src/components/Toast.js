import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';


const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
`;

const ToastItem = styled(motion.div)`
  background: ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .icon {
    font-size: 20px;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .message {
      font-size: 14px;
      opacity: 0.9;
    }
  }
  
  .close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const Toast = ({ toasts, removeToast }) => {
  return (
    <ToastContainer>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </div>
            <div className="content">
              <div className="title">{toast.title}</div>
              <div className="message">{toast.message}</div>
            </div>
            <button className="close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </ToastItem>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
};

export default Toast;
