import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Request interceptor for adding headers
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.error || 'Sunucu hatası');
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
      throw new Error('Bağlantı hatası - sunucuya erişilemiyor');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
      throw new Error('İstek hatası');
    }
  }
);

// PDF Operations API
export const pdfOperations = {
  // Merge PDFs
  merge: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/merge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    
    return response.data;
  },
  
  // Compress PDF
  compress: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/compress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Split PDF
  split: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/split', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Add watermark to PDF
  watermark: async (file, options) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', options.text);
    formData.append('opacity', options.opacity || 0.3);
    formData.append('position', options.position || 'center');

    const response = await api.post('/watermark', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Unlock PDF
  unlock: async (file, password) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const response = await api.post('/unlock', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Convert PDF to Word
  pdfToWord: async (file) => {
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/pdf-to-word', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Convert Word to PDF
  wordToPdf: async (file) => {
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/word-to-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  
  // Download processed file
  downloadFile: (filename) => {
    return `${API_BASE_URL.replace('/api', '')}/download/${filename}`;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
