const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const PDFMerger = require('pdf-merger-js');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const docxPdf = require('docx-pdf');
const officegen = require('officegen');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
    ];

    if (allowedTypes.includes(file.mimetype) ||
        file.originalname.toLowerCase().endsWith('.docx') ||
        file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece PDF ve DOCX dosyaları desteklenir!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Ensure directories exist
fs.ensureDirSync('./uploads');
fs.ensureDirSync('./processed');

// PDF Merge endpoint
app.post('/api/merge', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'En az 2 PDF dosyası gerekli' });
    }

    const merger = new PDFMerger();
    
    for (const file of req.files) {
      await merger.add(file.path);
    }

    const outputFilename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join('./processed', outputFilename);
    
    await merger.save(outputPath);
    
    // Clean up uploaded files
    req.files.forEach(file => fs.unlink(file.path));
    
    res.json({ 
      success: true, 
      message: 'PDF\'ler başarıyla birleştirildi',
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'PDF birleştirme hatası' });
  }
});

// PDF Compress endpoint
app.post('/api/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const inputPath = req.file.path;
    const outputFilename = `compressed-${Date.now()}.pdf`;
    const outputPath = path.join('./processed', outputFilename);

    // Read the PDF
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Save with compression
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      compress: true
    });
    
    fs.writeFileSync(outputPath, compressedPdfBytes);
    
    // Clean up uploaded file
    fs.unlink(inputPath);
    
    const originalSize = pdfBytes.length;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    res.json({ 
      success: true, 
      message: `PDF başarıyla sıkıştırıldı (${compressionRatio}% boyut azaltma)`,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      originalSize: originalSize,
      compressedSize: compressedSize,
      compressionRatio: compressionRatio
    });
  } catch (error) {
    console.error('Compress error:', error);
    res.status(500).json({ error: 'PDF sıkıştırma hatası' });
  }
});

// PDF Split endpoint
app.post('/api/split', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const inputPath = req.file.path;
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const splitFiles = [];

    // Split into individual pages
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const outputFilename = `split-page-${i + 1}-${Date.now()}.pdf`;
      const outputPath = path.join('./processed', outputFilename);

      const pdfBytes = await newPdf.save();
      fs.writeFileSync(outputPath, pdfBytes);

      splitFiles.push({
        filename: outputFilename,
        downloadUrl: `/download/${outputFilename}`,
        pageNumber: i + 1
      });
    }

    // Clean up uploaded file
    fs.unlink(inputPath);

    res.json({
      success: true,
      message: `${totalPages} ayrı PDF dosyası oluşturuldu`,
      files: splitFiles
    });
  } catch (error) {
    console.error('Split error:', error);
    res.status(500).json({ error: 'PDF bölme hatası' });
  }
});

// PDF Watermark endpoint
app.post('/api/watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const { text, opacity = 0.3, position = 'center' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Filigran metni gerekli' });
    }

    const inputPath = req.file.path;
    const outputFilename = `watermarked-${Date.now()}.pdf`;
    const outputPath = path.join('./processed', outputFilename);

    // Read the PDF
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize();

      // Create watermark text
      const font = await pdfDoc.embedFont('Helvetica');
      const fontSize = Math.min(width, height) * 0.05; // 5% of page size

      // Calculate position
      let x, y;
      switch (position) {
        case 'top-left':
          x = 50;
          y = height - 50;
          break;
        case 'top-right':
          x = width - 150;
          y = height - 50;
          break;
        case 'bottom-left':
          x = 50;
          y = 50 + fontSize;
          break;
        case 'bottom-right':
          x = width - 150;
          y = 50 + fontSize;
          break;
        case 'center':
        default:
          x = width / 2 - (font.stringWidth(text, { size: fontSize }) / 2);
          y = height / 2;
          break;
      }

      // Add watermark with transparency
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 },
        opacity: parseFloat(opacity)
      });
    }

    // Save the watermarked PDF
    const watermarkedBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, watermarkedBytes);

    // Clean up uploaded file
    fs.unlink(inputPath);

    res.json({
      success: true,
      message: `PDF başarıyla filigranlandı: "${text}"`,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename
    });
  } catch (error) {
    console.error('Watermark error:', error);
    res.status(500).json({ error: 'PDF filigran hatası' });
  }
});

// PDF Unlock endpoint
app.post('/api/unlock', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Şifre gerekli' });
    }

    const inputPath = req.file.path;
    const outputFilename = `unlocked-${Date.now()}.pdf`;
    const outputPath = path.join('./processed', outputFilename);

    try {
      // Try to load the PDF with the provided password
      const pdfBytes = fs.readFileSync(inputPath);
      const pdfDoc = await PDFDocument.load(pdfBytes, { password });

      // Remove password protection
      const unlockedBytes = await pdfDoc.save({
        useObjectStreams: true,
        // Don't set a new password to remove protection
      });

      fs.writeFileSync(outputPath, unlockedBytes);

      // Clean up uploaded file
      fs.unlink(inputPath);

      res.json({
        success: true,
        message: 'PDF şifresi başarıyla kaldırıldı',
        downloadUrl: `/download/${outputFilename}`,
        filename: outputFilename
      });
    } catch (passwordError) {
      // Clean up uploaded file on error
      fs.unlink(inputPath);
      return res.status(400).json({ error: 'Geçersiz şifre veya şifrelenmiş PDF dosyası' });
    }
  } catch (error) {
    console.error('Unlock error:', error);
    res.status(500).json({ error: 'PDF şifre kaldırma hatası' });
  }
});

// PDF to Word conversion endpoint
app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const inputPath = req.file.path;
    const outputFilename = `converted-${Date.now()}.docx`;
    const outputPath = path.join('./processed', outputFilename);

    // Read and parse PDF
    const pdfBuffer = fs.readFileSync(inputPath);
    const pdfData = await pdfParse(pdfBuffer);

    // Create a Word document using officegen
    const docx = officegen('docx');

    // Set document properties
    docx.on('error', (err) => {
      console.error('Officegen error:', err);
    });

    // Skip title and just process the content directly

    // Process text into paragraphs with better formatting
    const paragraphs = pdfData.text.split('\n\n').filter(p => p.trim());

    if (paragraphs.length === 0) {
      // If no paragraphs found, try splitting by single newlines
      const lines = pdfData.text.split('\n').filter(l => l.trim());
      lines.forEach(line => {
        if (line.trim()) {
          const p = docx.createP();
          p.addText(line.trim());
        }
      });
    } else {
      // Process found paragraphs
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          const p = docx.createP();
          p.addText(paragraph.trim());

          // Add spacing between paragraphs
          if (index < paragraphs.length - 1) {
            docx.createP();
          }
        }
      });
    }

    // Skip footer and just process the content

    // Generate and save the document
    const out = fs.createWriteStream(outputPath);

    out.on('error', (err) => {
      console.error('Write stream error:', err);
      fs.unlink(inputPath);
      return res.status(500).json({ error: 'Dosya yazma hatası' });
    });

    docx.generate(out);

    out.on('close', () => {
      // Verify file was created and has content
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        // Clean up uploaded file
        fs.unlink(inputPath);

        res.json({
          success: true,
          message: `PDF başarıyla Word'e dönüştürüldü (${pdfData.numpages} sayfa)`,
          downloadUrl: `/download/${outputFilename}`,
          filename: outputFilename,
          pages: pdfData.numpages
        });
      } else {
        fs.unlink(inputPath);
        fs.unlink(outputPath);
        res.status(500).json({ error: 'DOCX dosyası oluşturulamadı' });
      }
    });

  } catch (error) {
    console.error('PDF to Word error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path);
    }
    res.status(500).json({ error: 'PDF\'den Word\'e dönüşüm hatası' });
  }
});

// Word to PDF conversion endpoint
app.post('/api/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Word dosyası gerekli' });
    }

    const inputPath = req.file.path;
    const outputFilename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join('./processed', outputFilename);

    // Check if file is DOCX
    if (!req.file.originalname.toLowerCase().endsWith('.docx')) {
      fs.unlink(inputPath);
      return res.status(400).json({ error: 'Sadece .docx dosyaları desteklenir' });
    }

    // Extract text and formatting from DOCX
    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;

    if (!text || text.trim().length === 0) {
      fs.unlink(inputPath);
      return res.status(400).json({ error: 'Word dosyasında metin bulunamadı' });
    }

    // Create PDF with better formatting
    const pdfDoc = await PDFDocument.create();

    // PDF settings
    const pageWidth = 595; // A4 width in points
    const pageHeight = 842; // A4 height in points
    const margin = 50;
    const maxWidth = pageWidth - (margin * 2);
    const fontSize = 12;
    const lineHeight = fontSize * 1.4;
    const titleFontSize = 16;

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin - titleFontSize;
    let pageNumber = 1;

    // Embed fonts - use standard fonts that support more characters
    const regularFont = await pdfDoc.embedFont('Times-Roman');
    const boldFont = await pdfDoc.embedFont('Times-Bold');

    // Function to clean Turkish characters for safe encoding
    const cleanText = (text) => {
      return text
        .replace(/İ/g, 'I')
        .replace(/ı/g, 'i')
        .replace(/Ğ/g, 'G')
        .replace(/ğ/g, 'g')
        .replace(/Ü/g, 'U')
        .replace(/ü/g, 'u')
        .replace(/Ş/g, 'S')
        .replace(/ş/g, 's')
        .replace(/Ö/g, 'O')
        .replace(/ö/g, 'o')
        .replace(/Ç/g, 'C')
        .replace(/ç/g, 'c');
    };

    // Skip title and start directly with content
    yPosition = pageHeight - margin;

    // Process paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    let isFirstParagraph = true;

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;

      const cleanParagraph = cleanText(paragraph.trim());
      const words = cleanParagraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = regularFont.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth && currentLine) {
          // Draw current line
          if (yPosition < margin + lineHeight) {
            // Need new page
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
            pageNumber++;
          }

          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: regularFont
          });

          yPosition -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      // Draw remaining text
      if (currentLine) {
        if (yPosition < margin + lineHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
          pageNumber++;
        }

        currentPage.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: regularFont
        });

        yPosition -= lineHeight;
      }

      // Add space between paragraphs
      if (!isFirstParagraph) {
        yPosition -= lineHeight * 0.5;
      }
      isFirstParagraph = false;
    }

    // Add page numbers
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      const pageNumText = `${index + 1}`;
      const pageNumWidth = regularFont.widthOfTextAtSize(pageNumText, 10);

      page.drawText(pageNumText, {
        x: pageWidth - margin - pageNumWidth,
        y: margin - 10,
        size: 10,
        font: regularFont,
        color: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 }
      });
    });

    // Skip footer information

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    // Clean up uploaded file
    fs.unlink(inputPath);

    res.json({
      success: true,
      message: `Word dosyası başarıyla PDF'e dönüştürüldü (${pages.length} sayfa)`,
      downloadUrl: `/download/${outputFilename}`,
      filename: outputFilename,
      pages: pages.length
    });
  } catch (error) {
    console.error('Word to PDF error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path);
    }
    res.status(500).json({ error: 'Word\'den PDF\'e dönüşüm hatası' });
  }
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('./processed', filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (!err) {
        // Clean up file after download
        setTimeout(() => fs.unlink(filePath), 10000);
      }
    });
  } else {
    res.status(404).json({ error: 'Dosya bulunamadı' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ATAPDF Backend is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Dosya boyutu çok büyük (max 10MB)' });
    }
  }
  
  if (error.message === 'Only PDF files are allowed!') {
    return res.status(400).json({ error: 'Sadece PDF dosyaları kabul ediliyor' });
  }
  
  res.status(500).json({ error: 'Sunucu hatası' });
});

// Start server
app.listen(PORT, () => {
  console.log(`ATAPDF Backend server is running on port ${PORT}`);
});

module.exports = app;
