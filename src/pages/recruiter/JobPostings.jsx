import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Info, Plus, X, Loader, ChevronUp, ChevronDown } from 'lucide-react';
import CreateJob from '../../components/dashboard/admin/CreateJob.jsx';
import * as XLSX from 'xlsx';

const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error('Error caught by ErrorBoundary:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
};

const JobPostings = () => {
  const [activeView, setActiveView] = useState('active');
  const [creationMethod, setCreationMethod] = useState('manual');
  const [isUploading, setIsUploading] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [excelData, setExcelData] = useState(null);
  const fileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);

  // Mock data for job postings
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Frontend Developer', company: 'WebTech', status: 'Live', applications: 24, views: 153, datePosted: '2023-10-26' },
    { id: '2', title: 'Data Scientist', company: 'DataCorp', status: 'Live', applications: 42, views: 287, datePosted: '2023-10-25' },
    { id: '3', title: 'DevOps Engineer', company: 'Cloudify', status: 'Pending Approval', applications: 0, views: 15, datePosted: '2023-10-27' },
  ]);

  // Mock data for drafts
  const [drafts, setDrafts] = useState([
    { id: 'd1', title: 'UX Designer', company: 'DesignHub', lastModified: '2023-10-24' },
    { id: 'd2', title: 'Backend Engineer', company: 'ServerStack', lastModified: '2023-10-23' },
  ]);

  // Handle Excel file upload
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadError('Please upload a valid Excel file (.xlsx or .xls).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setExcelData(null);

    try {
      const data = await readExcelFile(file);
      setExcelData(data);
      
      // Auto-populate the manual entry form if we're in manual mode
      if (creationMethod === 'manual' && data.length > 0) {
        // You can pass this data to CreateJob component or handle it as needed
        console.log('Excel data ready for manual entry:', data);
      }
    } catch (err) {
      setUploadError('Failed to read Excel file. Please make sure it\'s a valid Excel file.');
      console.error('Excel upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Process the data to extract job information
          const processedData = processExcelData(jsonData);
          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const processExcelData = (data) => {
    if (!data || data.length === 0) return [];

    // Assuming first row is headers
    const headers = data[0];
    const rows = data.slice(1);
    
    // Map headers to expected job fields
    const jobData = rows.map((row, index) => {
      const job = {};
      
      headers.forEach((header, colIndex) => {
        if (header && row[colIndex] !== undefined) {
          const key = header.toLowerCase().replace(/\s+/g, '_');
          job[key] = row[colIndex];
        }
      });
      
      return {
        ...job,
        id: `excel-${index}`,
        rowNumber: index + 2 // +2 because of header row and 1-based indexing in Excel
      };
    }).filter(job => Object.keys(job).length > 1); // Filter out empty rows

    return jobData;
  };

  const handleUseExcelData = () => {
    if (excelData && excelData.length > 0) {
      // Switch to manual entry mode and pass the excel data
      setCreationMethod('manual');
      // You might want to pass this data to CreateJob component via props or context
      console.log('Using Excel data for manual entry:', excelData);
      alert(`Found ${excelData.length} job(s) in Excel file. Please review and complete the details in the manual entry form.`);
    }
  };

  // Handle file upload for JD parsing (existing function)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setParseResult(null);

    try {
      // Simulate API call for parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedData = {
        success: true,
        data: {
          jobTitle: 'Full Stack Developer',
          company: 'Tech Innovations Inc.',
          responsibilities: 'Develop and maintain web applications using React and Node.js...',
          skills: ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3'],
          salary: '',
        },
        confidence: 0.7,
      };

      if (simulatedData.success) {
        setParseResult(simulatedData);
      } else {
        setUploadError('Failed to parse the document. Please try manual entry.');
      }
    } catch (err) {
      setUploadError('An error occurred during upload. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInputRef.current.files = files;
      handleFileUpload({ target: { files } });
    }
  };

  const handleExcelDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleExcelDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length) {
      excelFileInputRef.current.files = files;
      handleExcelUpload({ target: { files } });
    }
  };

  const handleUseParsedData = () => {
    alert('Parsed data would be sent for approval or opened in an editable form.');
    setActiveView('active');
  };

  const handleCloseJob = (jobId) => {
    console.log('Closing job:', jobId);
    alert(`Job ${jobId} closed.`);
  };

  const handleCloneJob = (jobId) => {
    console.log('Cloning job:', jobId);
    alert(`Job ${jobId} cloned. You are now editing the new draft.`);
  };

  // Handler for job submission from CreateJob component
  const handleJobSubmit = (jobData) => {
    console.log('Job submitted:', jobData);
    alert('Job submitted for approval successfully!');
    setActiveView('active'); // Return to active postings view
  };

  // Render the active view based on state
  const renderActiveView = () => {
    switch (activeView) {
      case 'active':
        return <ActivePostingsView jobs={jobs} onCloseJob={handleCloseJob} onCloneJob={handleCloneJob} />;
      case 'drafts':
        return <DraftPostingsView drafts={drafts} />;
      case 'new':
        return <NewJobView 
          creationMethod={creationMethod} 
          setCreationMethod={setCreationMethod} 
          isUploading={isUploading} 
          parseResult={parseResult} 
          uploadError={uploadError}
          fileInputRef={fileInputRef} 
          handleFileUpload={handleFileUpload} 
          handleDragOver={handleDragOver} 
          handleDrop={handleDrop} 
          handleUseParsedData={handleUseParsedData}
          onJobSubmit={handleJobSubmit}
          excelData={excelData}
          handleExcelUpload={handleExcelUpload}
          handleExcelDragOver={handleExcelDragOver}
          handleExcelDrop={handleExcelDrop}
          handleUseExcelData={handleUseExcelData}
          excelFileInputRef={excelFileInputRef}
        />;
      default:
        return <ActivePostingsView jobs={jobs} onCloseJob={handleCloseJob} onCloneJob={handleCloneJob} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <button
            onClick={() => setActiveView('new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            + Post a New Job
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200 inline-flex mb-8">
          <button
            onClick={() => setActiveView('active')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'active' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active Postings
          </button>
          <button
            onClick={() => setActiveView('drafts')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'drafts' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveView('new')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeView === 'new' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            + New Job
          </button>
        </div>

        {/* Render the active view */}
        {renderActiveView()}
      </div>
    </ErrorBoundary>
  );
};

// Sub-components
const ActivePostingsView = ({ jobs, onCloseJob, onCloneJob }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applications}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.views}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.datePosted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button title="View Analytics" className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100">
                      <BarChart3Icon />
                    </button>
                    <button title="Edit" className="text-gray-400 hover:text-green-600 p-1 rounded hover:bg-gray-100">
                      <EditIcon />
                    </button>
                    <button title="Clone" onClick={() => onCloneJob(job.id)} className="text-gray-400 hover:text-purple-600 p-1 rounded hover:bg-gray-100">
                      <CopyIcon />
                    </button>
                    <button title="Close Job" onClick={() => onCloseJob(job.id)} className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100">
                      <ArchiveIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DraftPostingsView = ({ drafts }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((draft) => (
              <tr key={draft.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{draft.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.lastModified}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100">Edit</button>
                    <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewJobView = ({ 
  creationMethod, setCreationMethod, isUploading, parseResult, uploadError, 
  fileInputRef, handleFileUpload, handleDragOver, handleDrop, handleUseParsedData, onJobSubmit,
  excelData, handleExcelUpload, handleExcelDragOver, handleExcelDrop, handleUseExcelData, excelFileInputRef
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Sub-Navigation Tabs: Manual vs. Upload */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-sm p-1 shadow-sm border border-gray-200 inline-flex gap-2">
          <button
            onClick={() => setCreationMethod('manual')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              creationMethod === 'manual'
                ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Manual Entry
          </button>

          <button
            onClick={() => setCreationMethod('upload')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              creationMethod === 'upload'
                ? 'bg-gradient-to-tr to-blue-600 from-purple-700 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload JD
          </button>
          <button
            onClick={() => setCreationMethod('upload Excel')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              creationMethod === 'upload Excel'
                ? 'bg-gradient-to-tr to-blue-600 from-purple-700 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload Excel
          </button>
        </div>
      </div>

      {creationMethod === 'manual' ? (
        <CreateJob onJobSubmit={onJobSubmit} excelData={excelData} />
      ) : creationMethod === 'upload' ? (
        <JDUploadForm 
          isUploading={isUploading} 
          parseResult={parseResult} 
          uploadError={uploadError}
          fileInputRef={fileInputRef} 
          handleFileUpload={handleFileUpload}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleUseParsedData={handleUseParsedData}
        />
      ) : (
        <ExcelUploadForm 
          isUploading={isUploading}
          excelData={excelData}
          uploadError={uploadError}
          excelFileInputRef={excelFileInputRef}
          handleExcelUpload={handleExcelUpload}
          handleExcelDragOver={handleExcelDragOver}
          handleExcelDrop={handleExcelDrop}
          handleUseExcelData={handleUseExcelData}
        />
      )}
    </div>
  );
};

const JDUploadForm = ({ 
  isUploading, parseResult, uploadError, fileInputRef, handleFileUpload, 
  handleDragOver, handleDrop, handleUseParsedData 
}) => {
  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <LoaderIcon />
            <p className="text-gray-700">Analyzing your JD...</p>
          </div>
        ) : parseResult ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircleIcon />
            <p className="text-lg font-medium text-gray-900">JD Parsed Successfully!</p>
            <p className="text-sm text-gray-600">We've extracted the key details from your document.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon />
            <div>
              <p className="text-lg font-medium text-gray-900">Drag & Drop your Job Description</p>
              <p className="text-sm text-gray-600">or</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX • Max 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircleIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Parsing Results & Edit Form */}
      {parseResult && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-gray-900">Parsed Details</h3>
          <p className="text-sm text-gray-600">
            <strong>Confidence Score:</strong> {Math.round(parseResult.confidence * 100)}%. Please review and edit the information below before submitting.
          </p>

          <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-md border">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.jobTitle || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, jobTitle: e.target.value}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Company *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.company || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, company: e.target.value}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Key Skills *</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.skills?.join(', ') || ''}
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, skills: e.target.value.split(',').map(skill => skill.trim())}})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Salary (CTC)</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    value={parseResult.data.salary || ''}
                    placeholder="Parser couldn't find this. Please add."
                    onChange={(e) => setParseResult({...parseResult, data: {...parseResult.data, salary: e.target.value}})}
                />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setParseResult(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Upload a Different File
            </button>
            <button
              type="button"
              onClick={handleUseParsedData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ExcelUploadForm = ({
  isUploading,
  excelData,
  uploadError,
  excelFileInputRef,
  handleExcelUpload,
  handleExcelDragOver,
  handleExcelDrop,
  handleUseExcelData
}) => {
  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleExcelDragOver}
        onDrop={handleExcelDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={excelFileInputRef}
          onChange={handleExcelUpload}
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <LoaderIcon />
            <p className="text-gray-700">Reading Excel file...</p>
          </div>
        ) : excelData ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircleIcon />
            <p className="text-lg font-medium text-gray-900">Excel File Processed Successfully!</p>
            <p className="text-sm text-gray-600">Found {excelData.length} job(s). Ready for manual entry.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <FileTextIcon />
            <div>
              <p className="text-lg font-medium text-gray-900">Drag & Drop your Excel File</p>
              <p className="text-sm text-gray-600">or</p>
            </div>
            <button
              type="button"
              onClick={() => excelFileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500">Supports XLSX, XLS • Max 10MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircleIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Excel Data Preview */}
      {excelData && excelData.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-gray-900">Excel Data Preview</h3>
          <p className="text-sm text-gray-600">
            Found {excelData.length} job(s) in the Excel file. Click "Use This Data" to fill the manual entry form.
          </p>

          <div className="bg-white rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {excelData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900">
                          {String(value || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {excelData.length > 5 && (
              <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500">
                Showing first 5 of {excelData.length} rows
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => excelFileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Upload Different File
            </button>
            <button
              type="button"
              onClick={handleUseExcelData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Use This Data for Manual Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon components (add FileTextIcon)
const BarChart3Icon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.586a1 1 0 01.707.293l2.707 2.707a1 1 0 010 1.414l-2.707 2.707A1 1 0 014.586 17H4v5h16v-5h-.586a1 1 0 01-.707-.293l-2.707-2.707a1 1 0 010-1.414l2.707-2.707A1 1 0 0119.414 9H20V4H4z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default JobPostings;