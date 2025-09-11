import React, { useState, useRef } from 'react';
import { ImMail } from 'react-icons/im';
import { MdEditNote } from 'react-icons/md';
import { GoBlocked } from 'react-icons/go';
import { FaEye, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { TbHistoryToggle } from 'react-icons/tb';

const dummyRecruiters = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  companyName: `Company ${i + 1}`,
  recruiterName: `Recruiter ${i + 1}`,
  email: `recruiter${i + 1}@example.com`,
  center: ['Lucknow', 'Pune', 'Bangalore', 'Delhi'][i % 4],
  totalJobPostings: Math.floor(Math.random() * 100),
  lastJobPostedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString(),
  status: i % 3 === 0 ? 'Blocked' : i % 3 === 1 ? 'Active' : 'Pending',
  activityHistory: [
    { type: 'Job Posted', date: new Date().toLocaleDateString() },
    { type: 'Email Sent', date: new Date().toLocaleDateString() },
    { type: 'Profile Updated', date: new Date(Date.now() - 2 * 86400000).toLocaleDateString() },
  ],
}));

export default function RecruiterDirectory() {
  const [search, setSearch] = useState('');
  const [expandedRecruiter, setExpandedRecruiter] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });

  const filteredRecruiters = dummyRecruiters.filter((recruiter) => {
    const searchLower = search.toLowerCase();
    return (
      recruiter.companyName.toLowerCase().includes(searchLower) ||
      recruiter.recruiterName.toLowerCase().includes(searchLower) ||
      recruiter.email.toLowerCase().includes(searchLower) ||
      recruiter.center.toLowerCase().includes(searchLower)
    );
  });

  const sortedRecruiters = React.useMemo(() => {
    let sortableItems = [...filteredRecruiters];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRecruiters, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleExpand = (id) => {
    setExpandedRecruiter((prev) => (prev === id ? null : id));
  };

  const getHeaderClass = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  };

  const openMailModal = (email) => {
    setEmailData({ to: email, subject: '', body: '' });
    setIsModalOpen(true);
  };

  const closeMailModal = () => {
    setIsModalOpen(false);
    setEmailData({ to: '', subject: '', body: '' });
  };

  const handleSendMail = () => {
    console.log('Sending email:', emailData);
    closeMailModal();
  };

  const getRecruiterSummary = (recruiter) => {
    const centers = ['Lucknow', 'Pune', 'Bangalore', 'Delhi'];
    const schools = ['SOT', 'SOH', 'SOM'];

    const jobsPerCenter = centers.reduce((acc, center) => {
      acc[center] = Math.floor(Math.random() * 10); // Replace with actual data
      return acc;
    }, {});

    const jobsPerSchool = schools.reduce((acc, school) => {
      acc[school] = Math.floor(Math.random() * 10); // Replace with actual data
      return acc;
    }, {});

    return {
      jobsPerCenter,
      jobsPerSchool,
      relationshipType: 'Partner Company', // Replace with actual data
      zone: 'North Zone', // Replace with actual data
    };
  };

  const RecruiterHistory = ({ recruiter }) => {
    const summary = getRecruiterSummary(recruiter);

    return (
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Activity History</h3>

        {/* Summary Section */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-600">Summary</h4>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Jobs per Center: {JSON.stringify(summary.jobsPerCenter)}</li>
            <li>Jobs per School: {JSON.stringify(summary.jobsPerSchool)}</li>
            <li>Relationship Type: {summary.relationshipType}</li>
            <li>Zone: {summary.zone}</li>
          </ul>
        </div>

        {/* Job Posting History */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-600">Job Posting History</h4>
          <ul className="list-disc pl-5 text-gray-600">
            {recruiter.activityHistory.map((activity, index) => (
              <li key={index}>
                Job Title: {activity.type}, Date: {activity.date}, Center: Lucknow, School: SOT, Status: Active
              </li>
            ))}
          </ul>
        </div>

        {/* Login History */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-600">Login History</h4>
          <ul className="list-disc pl-5 text-gray-600">
            <li>2025-09-10 10:00 AM</li>
            <li>2025-09-09 02:30 PM</li>
          </ul>
        </div>

        {/* Past Emails Sent */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-600">Past Emails Sent</h4>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Subject: Welcome, Date: 2025-09-08 11:00 AM, Status: Sent</li>
            <li>Subject: Reminder, Date: 2025-09-07 03:00 PM, Status: Sent</li>
          </ul>
        </div>

        {/* Status Change History */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-600">Status Change History</h4>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Status: Blocked, By: Admin, Date: 2025-09-06</li>
            <li>Status: Unblocked, By: Admin, Date: 2025-09-05</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Recruiter Directory</h1>
          <span className="text-sm text-gray-500">
            {filteredRecruiters.length} {filteredRecruiters.length === 1 ? 'recruiter' : 'recruiters'} found
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by recruiter name, company name, email, or center"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Recruiter Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => requestSort('companyName')}
                >
                  <div className={`flex items-center ${getHeaderClass('companyName')}`}>
                    Company Name
                    {sortConfig.key === 'companyName' && (
                      sortConfig.direction === 'ascending' ? 
                      <FaChevronUp className="ml-1 text-xs" /> : 
                      <FaChevronDown className="ml-1 text-xs" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => requestSort('recruiterName')}
                >
                  <div className={`flex items-center ${getHeaderClass('recruiterName')}`}>
                    Recruiter Name
                    {sortConfig.key === 'recruiterName' && (
                      sortConfig.direction === 'ascending' ? 
                      <FaChevronUp className="ml-1 text-xs" /> : 
                      <FaChevronDown className="ml-1 text-xs" />
                    )}
                  </div>
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">Email</th>
                <th 
                  className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => requestSort('center')}
                >
                  <div className={`flex items-center ${getHeaderClass('center')}`}>
                    Center
                    {sortConfig.key === 'center' && (
                      sortConfig.direction === 'ascending' ? 
                      <FaChevronUp className="ml-1 text-xs" /> : 
                      <FaChevronDown className="ml-1 text-xs" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => requestSort('lastJobPostedAt')}
                >
                  <div className={`flex items-center ${getHeaderClass('lastJobPostedAt')}`}>
                    Last Job Posted
                    {sortConfig.key === 'lastJobPostedAt' && (
                      sortConfig.direction === 'ascending' ? 
                      <FaChevronUp className="ml-1 text-xs" /> : 
                      <FaChevronDown className="ml-1 text-xs" />
                    )}
                  </div>
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">Status</th>
                <th className="p-3 text-center text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRecruiters.map((recruiter) => (
                <React.Fragment key={recruiter.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4 text-gray-800 text-sm font-medium">{recruiter.companyName}</td>
                    <td className="p-4 text-gray-800 text-sm">{recruiter.recruiterName}</td>
                    <td className="p-4 text-gray-800 text-sm">{recruiter.email}</td>
                    <td className="p-4 text-gray-800 text-sm">{recruiter.center}</td>
                    <td className="p-4 text-gray-800 text-sm text-center">{recruiter.lastJobPostedAt}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recruiter.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : recruiter.status === 'Blocked' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recruiter.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="relative group">
                          <ImMail 
                            className="text-blue-500 cursor-pointer text-lg hover:text-blue-700 transition-colors" 
                            onClick={() => openMailModal(recruiter.email)}
                          />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Send Mail
                          </span>
                        </div>
                        <div className="relative group">
                          <FaEye className="text-purple-500 cursor-pointer text-lg hover:text-purple-700 transition-colors" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            View Job Descriptions
                          </span>
                        </div>
                        <div className="relative group">
                          <MdEditNote className="text-green-500 cursor-pointer text-xl hover:text-green-700 transition-colors" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Edit Info
                          </span>
                        </div>
                        <div className="relative group">
                          <GoBlocked className="text-red-500 cursor-pointer text-xl hover:text-red-700 transition-colors" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {recruiter.status === 'Active' ? 'Block' : 'Unblock'}
                          </span>
                        </div>
                        <div className="relative group flex justify-center">
  <button
    onClick={() => toggleExpand(recruiter.id)}
    className="flex items-center justify-center p-2"
    aria-label={expandedRecruiter === recruiter.id ? 'Hide History' : 'View History'}
  >
    <TbHistoryToggle 
      className={`text-yellow-600 text-xl transition-transform duration-300 ${expandedRecruiter === recruiter.id ? 'rotate-180' : ''}`} 
    />
  </button>
  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-10 whitespace-nowrap">
    {expandedRecruiter === recruiter.id ? 'Hide History' : 'View History'}
    <svg className="absolute text-gray-900 h-2 left-1/2 -translate-x-1/2 top-full" x="0px" y="0px" viewBox="0 0 255 255">
      <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
    </svg>
  </span>
</div>
</div>
</td>
</tr>
{expandedRecruiter === recruiter.id && (
<tr>
  <td colSpan="7" className="p-4 bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="bg-white rounded-xl shadow-inner p-5 border border-gray-200">
      <RecruiterHistory recruiter={recruiter} />
    </div>
  </td>
</tr>
)}
</React.Fragment>
))}
</tbody>
</table>
</div>

        {filteredRecruiters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recruiters found matching your search criteria.
          </div>
        )}
      </div>

      <MailModal 
        isModalOpen={isModalOpen} 
        closeMailModal={closeMailModal} 
        emailData={emailData} 
        setEmailData={setEmailData} 
        handleSendMail={handleSendMail} 
      />
    </div>
  );
}

const MailModal = ({ isModalOpen, closeMailModal, emailData, setEmailData, handleSendMail }) => {
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [cc, setCC] = useState('');
  const [bcc, setBCC] = useState('');
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);

  // Text formatting functions
  const formatText = (format) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = emailData.body.substring(start, end);
    let newText = emailData.body;

    switch (format) {
      case 'bold':
        newText =
          emailData.body.substring(0, start) +
          `<strong>${selectedText}</strong>` +
          emailData.body.substring(end);
        break;
      case 'italic':
        newText =
          emailData.body.substring(0, start) +
          `<em>${selectedText}</em>` +
          emailData.body.substring(end);
        break;
      case 'underline':
        newText =
          emailData.body.substring(0, start) +
          `<u>${selectedText}</u>` +
          emailData.body.substring(end);
        break;
      default:
        break;
    }

    setEmailData({ ...emailData, body: newText });

    // Wait for state update then set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end + (format === 'bold' ? 17 : 9));
    }, 0);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments([...attachments, ...files]);
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Handle send with CC/BCC
  const handleSendWithRecipients = () => {
    const finalData = {
      ...emailData,
      cc: showCC ? cc : '',
      bcc: showBCC ? bcc : '',
      attachments: attachments,
    };

    // In a real app, you would do something with this data
    console.log('Sending email with:', finalData);
    handleSendMail();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={closeMailModal}
              className="p-2 rounded-full hover:bg-gray-100 mr-2"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-gray-800">New Message</h2>
          </div>
        </div>

        {/* Email Composition Area */}
        <div className="flex-1 overflow-auto">
          {/* Recipient Field */}
          <div className="px-6 py-3 border-b border-gray-200 flex items-start">
            <div className="w-20 pt-2 text-sm text-gray-600">To</div>
            <div className="flex-1">
              <input
                type="text"
                value={emailData.to}
                readOnly
                className="w-full p-2 text-gray-600 bg-white border-b border-transparent focus:outline-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                <button 
                  onClick={() => setShowCC(!showCC)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Cc
                </button>
                <button 
                  onClick={() => setShowBCC(!showBCC)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Bcc
                </button>
              </div>
            </div>
          </div>
          
          {/* CC Field - Conditionally Rendered */}
          {showCC && (
            <div className="px-6 py-3 border-b border-gray-200 flex items-center">
              <div className="w-20 text-sm text-gray-600">Cc</div>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCC(e.target.value)}
                placeholder="Enter CC recipients"
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
          )}
          
          {/* BCC Field - Conditionally Rendered */}
          {showBCC && (
            <div className="px-6 py-3 border-b border-gray-200 flex items-center">
              <div className="w-20 text-sm text-gray-600">Bcc</div>
              <input
                type="text"
                value={bcc}
                onChange={(e) => setBCC(e.target.value)}
                placeholder="Enter BCC recipients"
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
          )}
          
          {/* Subject Field */}
          <div className="px-6 py-3 border-b border-gray-200 flex items-center">
            <div className="w-20 text-sm text-gray-600">Subject</div>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Add a subject"
              className="flex-1 p-2 focus:outline-none"
            />
          </div>
          
          {/* Message Body */}
          <div className="px-6 py-4 h-96">
            <textarea
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              className="w-full h-full p-2 resize-none focus:outline-none border border-gray-200 rounded"
              placeholder="Compose your email here..."
            ></textarea>
          </div>
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="px-6 py-2 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-3 py-1 text-sm">
                    <span className="mr-2">{file.name}</span>
                    <button 
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Formatting Toolbar and Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4">
          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-2 mb-4">
            <button 
              onClick={() => formatText('bold')}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 font-bold"
              title="Bold"
            >
              B
            </button>
            <button 
              onClick={() => formatText('italic')}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 italic"
              title="Italic"
            >
              I
            </button>
            <button 
              onClick={() => formatText('underline')}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 underline"
              title="Underline"
            >
              U
            </button>
            
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              title="Attach files"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Insert link">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600" title="Insert emoji">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSendWithRecipients}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600" title="Save draft">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600" 
                title="Delete"
                onClick={closeMailModal}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={closeMailModal}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};