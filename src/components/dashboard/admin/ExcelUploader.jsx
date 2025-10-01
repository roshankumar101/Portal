import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader, Check, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export const EXCEL_TEMPLATE = [
  {
    'Job Title': 'e.g., Software Engineer',
    'Company': 'e.g., Tech Corp',
    'Job Type': 'e.g., Full-Time or Internship',
    'Work Mode': 'e.g., Onsite, Remote, or Hybrid',
    'Location': 'e.g., Bangalore, India',
    'Openings': 'e.g., 5',
    'Salary/Stipend': 'e.g., 10-15 LPA or 25k/month',
    'Duration': 'e.g., 6 months (for internships)',
    'Description': 'Detailed job description...',
    'Requirements': 'Required skills and qualifications...',
    'Responsibilities': 'Key responsibilities...',
    'Qualifications': 'e.g., B.Tech in Computer Science',
    'Experience': 'e.g., 0-2 years',
    'Skills': 'e.g., JavaScript, React, Node.js',
    'Application Deadline': 'DD/MM/YYYY'
  }
];

const ExcelUploader = ({ onFileProcessed, onBack }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);
  const dropRef = React.useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const data = await readExcelFile(file);
      if (data && data.length > 0) {
        onFileProcessed?.(data[0]); // Process first sheet's first row
      } else {
        setUploadError('No valid data found in the Excel file');
      }
    } catch (error) {
      console.error('Error processing Excel:', error);
      setUploadError('Failed to process Excel file. Please check the format.');
    } finally {
      setIsUploading(false);
    }
  }, [onFileProcessed]);

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel')) {
      processFile(file);
    } else {
      setUploadError('Please upload a valid Excel file (.xlsx or .xls)');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel')) {
      processFile(file);
    } else {
      setUploadError('Please upload a valid Excel file (.xlsx or .xls)');
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(EXCEL_TEMPLATE);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Job Template');
    XLSX.writeFile(wb, 'Job_Description_Template.xlsx');
  };

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">Processing Excel File</h3>
        <p className="text-gray-500">Extracting job details from your spreadsheet...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Upload Job Description (Excel)</h2>
      </div>
      
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Excel Format Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Use the first row for column headers</p>
              <p>• Include required fields: Job Title, Company, Job Type</p>
              <p>• Download our template to ensure proper formatting</p>
            </div>
            <div className="mt-4">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-green-100">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-green-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">Excel file (.xlsx, .xls) up to 5MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Select Excel File
          </button>
        </div>
      </div>
      
      {uploadError && (
        <div className="mt-4 text-sm text-red-600">
          {uploadError}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ExcelUploader;
