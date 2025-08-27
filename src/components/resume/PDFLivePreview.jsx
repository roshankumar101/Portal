import React, { useState, useEffect, useRef } from 'react';
import { ensureResumeDoc, subscribeResume, upsertResume } from '../../services/resumes';
import { pdfGenerator } from '../../services/pdfGenerator';
import PDFPreviewErrorBoundary from './PDFPreviewErrorBoundary';
import { FileText, Edit3, Eye, Upload, AlertCircle, Download } from 'lucide-react';

export default function PDFLivePreview({ uid, resumeId = 'default', resumeUrl, hasResume, onUploadClick }) {
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState('original');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [currentPdfBlob, setCurrentPdfBlob] = useState(null);
  const mountedRef = useRef(true);
  const unsubscribeRef = useRef(null);
  const debounceRef = useRef(null);
  const pdfDebounceRef = useRef(null);

  // Subscribe to Firestore resume data
  useEffect(() => {
    mountedRef.current = true;

    const setup = async () => {
      try {
        if (!uid) return;
        await ensureResumeDoc(uid, resumeId);
        unsubscribeRef.current = subscribeResume(
          uid,
          resumeId,
          (snap) => {
            if (!mountedRef.current) return;
            if (snap.exists()) {
              const data = snap.data();
              setPreviewMode(data.previewMode || 'original');
              if (data.originalText && !isEditing) {
                setEditableText(data.originalText);
              }
            }
          },
          (err) => {
            if (!mountedRef.current) return;
            setError(err.message);
          }
        );
      } catch (e) {
        setError(e.message);
      }
    };

    setup();

    return () => {
      mountedRef.current = false;
      if (unsubscribeRef.current) {
        try { unsubscribeRef.current(); } catch {}
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (pdfDebounceRef.current) {
        clearTimeout(pdfDebounceRef.current);
      }
      // Cleanup PDF resources
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      pdfGenerator.cleanup();
    };
  }, [uid, resumeId, isEditing]);

  // Extract text from PDF when uploaded
  useEffect(() => {
    if (hasResume && resumeUrl && !extractedText) {
      extractTextFromPDF();
    }
  }, [hasResume, resumeUrl, extractedText]);

  const extractTextFromPDF = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll simulate text extraction
      // In a real implementation, you'd use PDF.js or similar library
      const simulatedText = `John Doe
Software Engineer

Contact Information:
Email: john.doe@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

Professional Summary:
Experienced software engineer with 5+ years of experience in full-stack development. 
Proficient in React, Node.js, and cloud technologies.

Experience:
Senior Software Engineer | Tech Company | 2021 - Present
• Developed and maintained web applications using React and Node.js
• Led a team of 3 developers on multiple projects
• Improved application performance by 40%

Software Engineer | Previous Company | 2019 - 2021
• Built responsive web interfaces using modern JavaScript frameworks
• Collaborated with cross-functional teams to deliver high-quality software
• Implemented automated testing procedures

Education:
Bachelor of Science in Computer Science
University Name | 2015 - 2019

Skills:
• Programming Languages: JavaScript, Python, Java
• Frameworks: React, Node.js, Express
• Databases: MongoDB, PostgreSQL
• Cloud: AWS, Docker, Kubernetes`;

      setExtractedText(simulatedText);
      setEditableText(simulatedText);
      
      // Save to Firestore
      await upsertResume(uid, resumeId, { originalText: simulatedText });
      
    } catch (err) {
      setError('Failed to extract text from PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced PDF generation
  const debouncedPDFGeneration = (text) => {
    if (pdfDebounceRef.current) clearTimeout(pdfDebounceRef.current);
    pdfDebounceRef.current = setTimeout(async () => {
      if (!mountedRef.current) return;
      
      setPdfGenerating(true);
      setPdfError(null);
      
      try {
        // Revoke old URL
        if (pdfPreviewUrl) {
          URL.revokeObjectURL(pdfPreviewUrl);
          setPdfPreviewUrl(null);
        }
        
        const pdfBlob = await pdfGenerator.renderPDF(text);
        
        if (!mountedRef.current) return;
        
        const newUrl = URL.createObjectURL(pdfBlob);
        setPdfPreviewUrl(newUrl);
        setCurrentPdfBlob(pdfBlob);
      } catch (err) {
        if (!mountedRef.current) return;
        if (err.message !== 'Render cancelled') {
          setPdfError('Failed to generate PDF preview');
        }
      } finally {
        if (mountedRef.current) {
          setPdfGenerating(false);
        }
      }
    }, 400);
  };

  const debouncedSave = (text) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await upsertResume(uid, resumeId, { originalText: text });
      } catch (err) {
        setError('Failed to save changes: ' + err.message);
      }
    }, 500);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setEditableText(newText);
    debouncedSave(newText);
    debouncedPDFGeneration(newText);
  };

  // Generate PDF when text changes
  useEffect(() => {
    if (editableText) {
      debouncedPDFGeneration(editableText);
    }
  }, [editableText]);

  const handleDownloadPDF = () => {
    if (currentPdfBlob) {
      pdfGenerator.downloadPDF(currentPdfBlob, 'resume.pdf');
    }
  };

  const formatPreviewText = (text) => {
    if (!text) return '';
    
    // Simple formatting for preview
    return text
      .split('\n')
      .map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={index} />;
        
        // Headers (lines that are all caps or end with colon)
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.includes('@')) {
          return <h3 key={index} className="font-bold text-lg text-gray-900 mt-4 mb-2">{trimmed}</h3>;
        }
        
        // Section headers (lines ending with colon)
        if (trimmed.endsWith(':') && trimmed.length < 30) {
          return <h4 key={index} className="font-semibold text-base text-gray-800 mt-3 mb-1">{trimmed}</h4>;
        }
        
        // Bullet points
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          return <li key={index} className="ml-4 text-gray-700 mb-1">{trimmed.substring(1).trim()}</li>;
        }
        
        // Email/Phone/Links
        if (trimmed.includes('@') || trimmed.includes('linkedin.com') || trimmed.includes('github.com')) {
          return <p key={index} className="text-blue-600 text-sm mb-1">{trimmed}</p>;
        }
        
        // Regular text
        return <p key={index} className="text-gray-700 mb-1">{trimmed}</p>;
      });
  };

  if (!hasResume) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume Uploaded</h3>
          <p className="text-gray-500 mb-4">
            Upload a PDF resume to start live editing and preview.
          </p>
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Live Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
              isEditing 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4" />
                Preview Mode
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Edit Mode
              </>
            )}
          </button>
          {currentPdfBlob && (
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-600">Extracting text from PDF...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side - PDF Viewer or Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600 border-b">
            {isEditing ? 'Text Editor' : 'PDF Viewer'}
          </div>
          <div className="flex-1 overflow-hidden">
            {isEditing ? (
              <textarea
                value={editableText}
                onChange={handleTextChange}
                className="w-full h-full p-4 border-0 outline-none resize-none font-mono text-sm"
                placeholder="Start typing your resume content..."
              />
            ) : (
              resumeUrl && (
                <iframe
                  src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  title="Resume PDF"
                  className="w-full h-full border-0"
                />
              )
            )}
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600 border-b flex items-center justify-between">
            <span>Live Preview</span>
            {pdfPreviewUrl && (
              <button
                onClick={handleDownloadPDF}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <Download size={10} />
                Download
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            {pdfGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-500">Generating preview...</div>
              </div>
            ) : pdfPreviewUrl ? (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full border-0 bg-white"
                title="Resume Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-500">Start typing to see preview...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
