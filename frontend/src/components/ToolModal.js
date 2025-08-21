import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { pdfOperations } from '../services/api';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
  
  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragOver ? '#ff6b35' : '#ddd'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  background: ${props => props.$isDragOver ? '#fff8f5' : '#fafafa'};

  &:hover {
    border-color: #ff6b35;
    background: #fff8f5;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  margin-bottom: 1rem;
  
  &:hover {
    background: #e55a2b;
  }
`;

const FileList = styled.div`
  margin-bottom: 1.5rem;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #dc2626;
  }
`;

const ProcessButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background 0.3s;
  width: 100%;
  
  &:hover:not(:disabled) {
    background: #059669;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #ff6b35;
  border-radius: 4px;
`;

const ResultArea = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background: #10b981;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 1rem;
  transition: background 0.3s;
  
  &:hover {
    background: #059669;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const ToolModal = ({ tool, onClose, onShowToast }) => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkPosition, setWatermarkPosition] = useState('center');
  const [unlockPassword, setUnlockPassword] = useState('');

  const handleFileSelect = useCallback((selectedFiles) => {
    // Add DOCX support for Word to PDF conversion
    if (tool.name === 'Word\'den PDF\'e') {
      // This block can be empty for now
    }

    const validFiles = Array.from(selectedFiles).filter(file => {
      if (tool.name === 'Word\'den PDF\'e') {
        return file.name.toLowerCase().endsWith('.docx');
      }
      return file.type === 'application/pdf';
    });

    if (validFiles.length === 0) {
      const fileType = tool.name === 'Word\'den PDF\'e' ? 'DOCX' : 'PDF';
      onShowToast({
        type: 'error',
        title: 'Hata',
        message: `Lütfen sadece ${fileType} dosyaları seçin`
      });
      return;
    }

    setFiles(validFiles);
    setError(null);
    setResult(null);
  }, [onShowToast, tool.name]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      onShowToast({
        type: 'warning',
        title: 'Uyarı',
        message: 'Lütfen en az bir dosya seçin'
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      let response;
      
      if (tool.name === 'PDF Birleştir' && files.length >= 2) {
        // Merge operation
        setProgress(25);
        response = await pdfOperations.merge(files);
        setProgress(100);
      } else if (tool.name === 'PDF Sıkıştır' && files.length === 1) {
        // Compress operation
        setProgress(50);
        response = await pdfOperations.compress(files[0]);
        setProgress(100);
      } else if (tool.name === 'PDF Böl' && files.length === 1) {
        // Split operation
        setProgress(75);
        response = await pdfOperations.split(files[0]);
        setProgress(100);
      } else if (tool.name === 'Filigran Ekle' && files.length === 1) {
        // Watermark operation
        if (!watermarkText.trim()) {
          throw new Error('Filigran metni gerekli');
        }
        setProgress(50);
        response = await pdfOperations.watermark(files[0], {
          text: watermarkText,
          opacity: watermarkOpacity,
          position: watermarkPosition
        });
        setProgress(100);
      } else if (tool.name === 'PDF Kilidini Aç' && files.length === 1) {
        // Unlock operation
        if (!unlockPassword.trim()) {
          throw new Error('PDF şifresi gerekli');
        }
        setProgress(50);
        response = await pdfOperations.unlock(files[0], unlockPassword);
        setProgress(100);
      } else if (tool.name === 'PDF\'den Word\'e' && files.length === 1) {
        // PDF to Word operation
        setProgress(50);
        response = await pdfOperations.pdfToWord(files[0]);
        setProgress(100);
      } else if (tool.name === 'Word\'den PDF\'e' && files.length === 1) {
        // Word to PDF operation
        setProgress(50);
        response = await pdfOperations.wordToPdf(files[0]);
        setProgress(100);
      } else {
        throw new Error('Bu işlem için uygun dosya sayısı seçilmedi');
      }
      
      setResult(response);
      
      onShowToast({
        type: 'success',
        title: 'Başarılı!',
        message: response.message
      });
      
    } catch (err) {
      setError(err.message);
      onShowToast({
        type: 'error',
        title: 'Hata',
        message: err.message
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetModal = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setWatermarkText('');
    setWatermarkOpacity(0.3);
    setWatermarkPosition('center');
    setUnlockPassword('');
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <ModalTitle>{tool.name}</ModalTitle>
          
          {!result && !isProcessing && (
            <>
              <UploadArea
                $isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileInput
                  type="file"
                  multiple={tool.name === 'PDF Birleştir'}
                  accept={tool.name === 'Word\'den PDF\'e' ? '.docx' : '.pdf'}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  id="file-input"
                />
                <UploadButton as="label" htmlFor="file-input">
                  Dosya Seçin
                </UploadButton>
                <p>veya dosyaları buraya sürükleyin</p>
                {tool.name === 'PDF Birleştir' && (
                  <small>En az 2 PDF dosyası seçin</small>
                )}
                {tool.name === 'Word\'den PDF\'e' && (
                  <small>Sadece .docx dosyaları desteklenir</small>
                )}
              </UploadArea>
              
              {files.length > 0 && (
                <FileList>
                  {files.map((file, index) => (
                    <FileItem key={index}>
                      <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <RemoveFileButton onClick={() => removeFile(index)}>×</RemoveFileButton>
                    </FileItem>
                  ))}
                </FileList>
              )}

              {tool.name === 'Filigran Ekle' && files.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>Filigran Ayarları</h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Filigran Metni:
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Filigran metnini girin"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Şeffaflık: {watermarkOpacity}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Pozisyon:
                    </label>
                    <select
                      value={watermarkPosition}
                      onChange={(e) => setWatermarkPosition(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="center">Orta</option>
                      <option value="top-left">Sol Üst</option>
                      <option value="top-right">Sağ Üst</option>
                      <option value="bottom-left">Sol Alt</option>
                      <option value="bottom-right">Sağ Alt</option>
                    </select>
                  </div>
                </div>
              )}

              {tool.name === 'PDF Kilidini Aç' && files.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4>PDF Şifre Kaldırma</h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      PDF Şifresi:
                    </label>
                    <input
                      type="password"
                      value={unlockPassword}
                      onChange={(e) => setUnlockPassword(e.target.value)}
                      placeholder="PDF'nin şifresini girin"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              )}
              
              <ProcessButton 
                onClick={processFiles} 
                disabled={files.length === 0}
              >
                İşlemi Başlat
              </ProcessButton>
            </>
          )}
          
          {isProcessing && (
            <div>
              <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Dosyalar işleniyor...
              </p>
              <ProgressBar>
                <ProgressFill
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </ProgressBar>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                %{progress} tamamlandı
              </p>
            </div>
          )}
          
          {error && (
            <ErrorMessage>
              <p><strong>Hata:</strong> {error}</p>
            </ErrorMessage>
          )}
          
          {result && (
            <ResultArea>
              <h3>✅ İşlem Tamamlandı!</h3>
              <p>{result.message}</p>
              
              {result.downloadUrl && (
                <DownloadButton 
                  href={pdfOperations.downloadFile(result.filename)} 
                  download
                >
                  Dosyayı İndir
                </DownloadButton>
              )}
              
              {result.files && (
                <div style={{ marginTop: '1rem' }}>
                  <p>Oluşturulan dosyalar:</p>
                  {result.files.map((file, index) => (
                    <DownloadButton 
                      key={index}
                      href={pdfOperations.downloadFile(file.filename)}
                      download
                      style={{ margin: '0.5rem', display: 'inline-block' }}
                    >
                      {file.filename}
                    </DownloadButton>
                  ))}
                </div>
              )}
              
              <ProcessButton 
                onClick={resetModal}
                style={{ marginTop: '1rem', background: '#6b7280' }}
              >
                Yeni İşlem Yap
              </ProcessButton>
            </ResultArea>
          )}
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default ToolModal;
