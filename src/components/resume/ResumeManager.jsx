import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  Eye, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  FilePlus,
  RefreshCw,
  Calendar,
  FileCheck
} from 'lucide-react';
import { 
  uploadResumeFile, 
  deleteResumeFile, 
  getResumeInfo, 
  getResumeData,
  validateResumeFile, 
  formatFileSize 
} from '../../services/resumeStorage';
import ResumePreview from './ResumePreview';

export default function ResumeManager({ userId, onResumeUpdate }) {
  const [resumeInfo, setResumeInfo] = useState({
    url: null,
    fileName: null,
    uploadedAt: null,
    hasResume: false
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewMode, setPreviewMode] = useState('pdf'); // 'pdf' or 'text'
  
  const fileInputRef = useRef(null);

  // Load resume info on component mount
  useEffect(() => {
    loadResumeInfo();
  }, [userId]);

  const loadResumeInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await getResumeInfo(userId);
      setResumeInfo(info);
      if (onResumeUpdate) {
        onResumeUpdate(info);
      }
    } catch (err) {
      setError('Failed to load resume information');
      console.error('Error loading resume info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file
    const validationErrors = validateResumeFile(file);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      setSuccess(null);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      const result = await uploadResumeFile(userId, file);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const newResumeInfo = {
        url: result.url,
        fileName: result.fileName,
        uploadedAt: result.uploadedAt,
        hasResume: true
      };
      
      setResumeInfo(newResumeInfo);
      setSuccess(`Resume "${result.fileName}" uploaded successfully!`);
      
      if (onResumeUpdate) {
        onResumeUpdate(newResumeInfo);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setUploadProgress(0);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      
      await deleteResumeFile(userId);
      
      const emptyResumeInfo = {
        url: null,
        fileName: null,
        uploadedAt: null,
        hasResume: false
      };
      
      setResumeInfo(emptyResumeInfo);
      setSuccess('Resume deleted successfully');
      
      if (onResumeUpdate) {
        onResumeUpdate(emptyResumeInfo);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (resumeInfo.url && resumeInfo.url.startsWith('firestore://')) {
      try {
        const resumeId = resumeInfo.url.replace('firestore://', '');
        const base64Data = await getResumeData(resumeId);
        
        if (base64Data) {
          const link = document.createElement('a');
          link.href = base64Data;
          link.download = resumeInfo.fileName || 'resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        setError('Failed to download resume');
        console.error('Download error:', error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    try {
      return new Date(date.toDate ? date.toDate() : date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading resume information...</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">User ID is required</span>
      </div>
    );
  }

  console.log('ResumeManager rendering with userId:', userId, 'resumeInfo:', resumeInfo);
  
  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-600">{success}</p>
          </div>
        </div>
      )}

      {/* Resume Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Resume Status
          </h3>
          <button
            onClick={loadResumeInfo}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {resumeInfo.hasResume ? (
          <div className="space-y-4">
            {/* Resume Info */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FileCheck className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-900">{resumeInfo.fileName}</h4>
                    <div className="flex items-center text-sm text-green-700 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Uploaded: {formatDate(resumeInfo.uploadedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md"
                    title="Download Resume"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    disabled={deleting}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md disabled:opacity-50"
                    title="Delete Resume"
                  >
                    {deleting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Resume Preview</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewMode('pdf')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        previewMode === 'pdf'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      PDF View
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-96 bg-gray-50">
                {previewMode === 'pdf' && resumeInfo.url && (
                  <ResumePreview resumeUrl={resumeInfo.url} />
                )}
              </div>
            </div>

            {/* Replace Resume Section */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Replace Resume</h4>
              <p className="text-sm text-gray-600 mb-3">
                Upload a new PDF to replace your current resume.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Uploading... {Math.round(uploadProgress)}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace Resume
                    </>
                  )}
                </button>
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* No Resume State */
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume Uploaded</h3>
            <p className="text-gray-500 mb-4">
              Upload your resume to get started. Drag and drop a PDF file here or click the button below.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Uploading... {Math.round(uploadProgress)}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </button>
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => window.open('https://www.canva.com/resumes/templates/', '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Create Resume
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Supported format: PDF (max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
}
