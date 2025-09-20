import React, { useState } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaEnvelope, 
  FaCalendarAlt,
  FaBriefcase,
  FaTrash,
  FaUserGraduate,
  FaQuestionCircle,
  FaSearch,
  FaEye,
  FaReply,
  FaCheckCircle,
  FaPaperPlane,
  FaRegCommentDots,
  FaFilePdf,
  FaFileAlt,
  FaUserTie,
  FaGraduationCap,
  FaClipboardCheck,
  FaUsers,
  FaChartLine,
  FaUniversity,
  FaIdBadge,
  FaClock,
  FaLink,
  FaDownload,
  FaCog,
  FaComment,
  FaShare,
  FaEnvelopeOpen
} from 'react-icons/fa';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'jd_approval',
      title: 'JD Approval Request from Microsoft',
      message: 'Microsoft has submitted a new Job Description for Software Engineer role. Please review the requirements and compensation details.',
      from: 'Rajesh Kumar (Recruiter)',
      time: '10:45 AM',
      date: 'Oct 28, 2023',
      isRead: false,
      priority: 'high',
      meta: { 
        company: 'Microsoft', 
        jdId: 'JD-2023-087',
        position: 'Software Engineer II',
        experience: '3+ years',
        location: 'Bengaluru (Hybrid)',
        salary: '₹18,00,000 - ₹25,00,000',
        skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
        description: 'Looking for a software engineer to join our Azure team working on cloud infrastructure solutions.',
        attachmentType: 'pdf',
        attachmentUrl: '/jds/microsoft-swe-2023.pdf',
        schools: ['SOT', 'SOM'],
        batches: ['2024', '2025', '2026'],
        deadline: '2023-11-15'
      }
    },
    {
      id: 2,
      type: 'student_query',
      title: 'Query about Placement Eligibility',
      message: 'Aarav Sharma asked: "I have a backlog in Mathematics-II from semester 2. Am I eligible to participate in the upcoming Amazon drive?"',
      from: 'Aarav Sharma (SOT, CSE, 2024 Batch)',
      enrollmentId: 'PWIOI-SOT-CSE-2024-087',
      time: '09:30 AM',
      date: 'Oct 28, 2023',
      isRead: false,
      priority: 'medium',
      meta: { 
        studentId: 'STU-2024-789', 
        queryId: 'QRY-1028',
        studentName: 'Aarav Sharma',
        school: 'SOT',
        program: 'B.Tech Computer Science',
        batch: '2024',
        year: 'Final Year',
        cgpa: '8.2',
        email: 'aarav.sharma@pwioi.student.in',
        phone: '+91 98765 43210',
        previousQueries: 2,
        queryCategory: 'Placement Eligibility',
        status: 'pending'
      }
    },
    {
      id: 3,
      type: 'cgpa_update',
      title: 'CGPA Update Request',
      message: 'Neha Patel has requested to update her CGPA from 8.7 to 9.2 for semester 5 results. Proof document attached.',
      from: 'Neha Patel (SOM, ECE, 2025 Batch)',
      enrollmentId: 'PWIOI-SOM-ECE-2025-134',
      time: '03:15 PM',
      date: 'Oct 27, 2023',
      isRead: true,
      priority: 'high',
      meta: { 
        studentId: 'STU-2025-456', 
        requestId: 'CGPA-1027',
        studentName: 'Neha Patel',
        school: 'SOM',
        program: 'B.Tech Electronics & Communication',
        batch: '2025',
        currentCgpa: '8.7',
        requestedCgpa: '9.2',
        semester: '5',
        proofType: 'marksheet',
        proofUrl: '/proofs/neha-patel-sem5-marksheet.pdf',
        status: 'pending_review',
        previousUpdates: 0
      }
    },
    {
      id: 4,
      type: 'interview',
      title: 'Google Interview Schedule Finalization',
      message: 'Google has proposed interview dates for SOT students. Please confirm availability of panels and infrastructure.',
      from: 'Google University Recruiting Team',
      time: '11:20 AM',
      date: 'Oct 27, 2023',
      isRead: true,
      priority: 'high',
      meta: { 
        company: 'Google', 
        date: '2023-11-20', 
        time: '09:00',
        duration: 'Full Day',
        interviewType: 'On-campus',
        position: 'Software Engineer',
        panelsRequired: 4,
        studentsShortlisted: 28,
        contactPerson: 'Priya Menon (Campus Lead)',
        schools: ['SOT'],
        batches: ['2024'],
        venue: 'PW IOI Campus, Building A, Floor 3'
      }
    },
    {
      id: 5,
      type: 'admin_collab',
      title: 'Coordination Required for Placement Drive',
      message: 'Dr. Sharma from SOM needs to coordinate with you regarding the scheduling of Adobe drive for SOT and SOM students.',
      from: 'Admin System',
      time: '04:45 PM',
      date: 'Oct 26, 2023',
      isRead: true,
      priority: 'medium',
      meta: { 
        fromAdmin: 'Dr. Vikram Sharma (SOM Placement Head)',
        toAdmin: 'Placement Office SOT',
        purpose: 'Coordinate Adobe Drive Schedule',
        urgency: 'medium',
        meetingRequested: true,
        preferredTime: '2023-10-29T11:00',
        relatedDrive: 'Adobe 2024 Campus Hiring',
        studentsAffected: 42
      }
    },
    {
      id: 6,
      type: 'announcement',
      title: 'Placement Training Schedule Update',
      message: 'Soft skills training schedule has been updated for 2024 batch students. Please inform respective department coordinators.',
      from: 'Placement Cell',
      time: '02:30 PM',
      date: 'Oct 26, 2023',
      isRead: true,
      priority: 'high',
      meta: { 
        event: 'Soft Skills Training', 
        date: '2023-11-05',
        changes: ['Timing updated from 2 PM to 3 PM', 'Venue changed to Auditorium B'],
        affectedBatches: ['2024'],
        affectedSchools: ['SOT', 'SOM', 'SOH'],
        coordinator: 'Ms. Anjali Mehta'
      }
    },
    {
      id: 7,
      type: 'application_review',
      title: 'Application Validation Request',
      message: 'Karan Singh has submitted his application for Goldman Sachs drive. Please validate his documents and eligibility.',
      from: 'Karan Singh (SOH, Finance, 2024 Batch)',
      enrollmentId: 'PWIOI-SOH-FIN-2024-056',
      time: '10:15 AM',
      date: 'Oct 25, 2023',
      isRead: false,
      priority: 'medium',
      meta: { 
        studentId: 'STU-2024-321', 
        applicationId: 'APP-GS-1025',
        company: 'Goldman Sachs',
        position: 'Financial Analyst Intern',
        documents: ['Resume', 'Transcript', 'Recommendation Letter'],
        status: 'pending_validation',
        school: 'SOH',
        program: 'BBA Finance',
        batch: '2024',
        cgpa: '8.9',
        appliedOn: '2023-10-24'
      }
    }
  ]);

  const filters = [
    { id: 'all', name: 'All', icon: <FaBell />, color: 'from-blue-50 to-blue-100' },
    { id: 'unread', name: 'Unread', icon: <FaEnvelope />, color: 'from-purple-50 to-purple-100' },
    { id: 'jd_approval', name: 'JD Approvals', icon: <FaBriefcase />, color: 'from-amber-50 to-amber-100' },
    { id: 'student_query', name: 'Student Queries', icon: <FaQuestionCircle />, color: 'from-teal-50 to-teal-100' },
    { id: 'cgpa_update', name: 'CGPA Updates', icon: <FaChartLine />, color: 'from-emerald-50 to-emerald-100' },
    { id: 'application_review', name: 'Applications', icon: <FaClipboardCheck />, color: 'from-indigo-50 to-indigo-100' },
    { id: 'admin_collab', name: 'Admin Coordination', icon: <FaUsers />, color: 'from-violet-50 to-violet-100' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'unread' ? !notification.isRead : 
                         notification.type === activeFilter);
    
    const matchesSearch = searchQuery === '' || 
                         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (notification.enrollmentId && notification.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const viewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleCgpaUpdate = (id, action) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { 
        ...notification, 
        isRead: true,
        meta: { ...notification.meta, status: action === 'approve' ? 'approved' : 'rejected' }
      } : notification
    ));
    setShowDetailModal(false);
  };

  const handleApplicationReview = (id, action) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { 
        ...notification, 
        isRead: true,
        meta: { ...notification.meta, status: action === 'approve' ? 'approved' : 'rejected' }
      } : notification
    ));
    setShowDetailModal(false);
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="px-2.5 py-1 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 text-xs font-medium rounded-full border border-rose-200 flex items-center w-fit"><FaClock className="mr-1" /> High Priority</span>;
      case 'medium': return <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-medium rounded-full border border-amber-200 flex items-center w-fit">Medium Priority</span>;
      case 'low': return <span className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium rounded-full border border-blue-200 flex items-center w-fit">Low Priority</span>;
      default: return null;
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'jd_approval': return <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 rounded-xl border border-amber-200 shadow-sm"><FaBriefcase className="text-lg" /></div>;
      case 'student_query': return <div className="p-2.5 bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 rounded-xl border border-teal-200 shadow-sm"><FaQuestionCircle className="text-lg" /></div>;
      case 'cgpa_update': return <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 rounded-xl border border-emerald-200 shadow-sm"><FaChartLine className="text-lg" /></div>;
      case 'application_review': return <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl border border-indigo-200 shadow-sm"><FaClipboardCheck className="text-lg" /></div>;
      case 'interview': return <div className="p-2.5 bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 rounded-xl border border-rose-200 shadow-sm"><FaCalendarAlt className="text-lg" /></div>;
      case 'admin_collab': return <div className="p-2.5 bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700 rounded-xl border border-violet-200 shadow-sm"><FaUsers className="text-lg" /></div>;
      case 'announcement': return <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 rounded-xl border border-purple-200 shadow-sm"><FaBell className="text-lg" /></div>;
      default: return <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl border border-gray-200 shadow-sm"><FaEnvelope className="text-lg" /></div>;
    }
  };

  const getActionButtons = (notification) => {
    switch(notification.type) {
      case 'jd_approval':
        return (
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => viewDetails(notification)}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-200 hover:to-blue-300"
            >
              <FaFileAlt className="mr-2" /> Review JD
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-emerald-200 hover:to-emerald-300">
              <FaCheck className="mr-2" /> Approve
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border border-rose-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-rose-200 hover:to-rose-300">
              <FaTimes className="mr-2" /> Request Changes
            </button>
          </div>
        );
      case 'student_query':
        return (
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => viewDetails(notification)}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-200 hover:to-blue-300"
            >
              <FaEye className="mr-2" /> View Details
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border border-teal-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-teal-200 hover:to-teal-300">
              <FaReply className="mr-2" /> Reply
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-purple-200 hover:to-purple-300">
              <FaPaperPlane className="mr-2" /> Send Policy
            </button>
          </div>
        );
      case 'cgpa_update':
        return (
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => viewDetails(notification)}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-200 hover:to-blue-300"
            >
              <FaEye className="mr-2" /> Review Request
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-emerald-200 hover:to-emerald-300">
              <FaCheck className="mr-2" /> Approve
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border border-rose-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-rose-200 hover:to-rose-300">
              <FaTimes className="mr-2" /> Reject
            </button>
          </div>
        );
      case 'application_review':
        return (
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => viewDetails(notification)}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-200 hover:to-blue-300"
            >
              <FaEye className="mr-2" /> Review Application
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-emerald-200 hover:to-emerald-300">
              <FaCheck className="mr-2" /> Validate
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border border-rose-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-rose-200 hover:to-rose-300">
              <FaTimes className="mr-2" /> Reject
            </button>
          </div>
        );
      default:
        return (
          <button 
            onClick={() => viewDetails(notification)}
            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 hover:from-gray-200 hover:to-gray-300"
          >
            <FaEye className="mr-2" /> View Details
          </button>
        );
    }
  };

  const renderDetailModal = () => {
    if (!selectedNotification) return null;
    
    const { type, meta, enrollmentId, from } = selectedNotification;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{selectedNotification.title}</h2>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-4">
                {getNotificationIcon(type)}
              </div>
              <div>
                <p className="text-gray-700 mb-2">{selectedNotification.message}</p>
                <div className="flex flex-col text-sm text-gray-500">
                  <span className="font-medium">From: {from}</span>
                  {enrollmentId && <span className="mt-1">Enrollment ID: {enrollmentId}</span>}
                  <span className="mt-2">{selectedNotification.date} at {selectedNotification.time}</span>
                </div>
              </div>
            </div>
            
            {/* JD Approval Details */}
            {type === 'jd_approval' && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  <FaBriefcase className="mr-2 text-amber-600" />
                  Job Description Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company</p>
                    <p className="font-medium">{meta.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Position</p>
                    <p className="font-medium">{meta.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experience Required</p>
                    <p className="font-medium">{meta.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-medium">{meta.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                    <p className="font-medium">{meta.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Deadline</p>
                    <p className="font-medium">{new Date(meta.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eligible Schools</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {meta.schools.map((school, index) => (
                        <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {school}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eligible Batches</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {meta.batches.map((batch, index) => (
                        <span key={index} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {batch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Job Description</p>
                  <p className="text-gray-700">{meta.description}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Key Skills Required</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {meta.skills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  {meta.attachmentType === 'pdf' ? (
                    <div className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                      <FaFilePdf className="mr-2" />
                      <span>JD Document</span>
                      <button className="ml-3 text-red-600 hover:text-red-800">
                        <FaDownload />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-700">{meta.description}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                    <FaCheck className="mr-2" /> Approve JD
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                    <FaTimes className="mr-2" /> Request Changes
                  </button>
                  <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                    <FaDownload className="mr-2" /> Download JD
                  </button>
                </div>
              </div>
            )}
            
            {/* Student Query Details */}
            {type === 'student_query' && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  <FaUserGraduate className="mr-2 text-teal-600" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="font-medium">{meta.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student ID</p>
                    <p className="font-medium">{meta.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">School</p>
                    <p className="font-medium">{meta.school}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Program</p>
                    <p className="font-medium">{meta.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Batch</p>
                    <p className="font-medium">{meta.batch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
                    <p className="font-medium">{meta.cgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium">{meta.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium">{meta.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Previous Queries</p>
                    <p className="font-medium">{meta.previousQueries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Query Category</p>
                    <p className="font-medium">{meta.queryCategory}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">Query Details</h4>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{selectedNotification.message.split('asked: ')[1]?.replace(/"/g, '')}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">Reply to Student</h4>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Type your response here..."
                  ></textarea>
                  <div className="flex gap-3 mt-4">
                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                      <FaPaperPlane className="mr-2" /> Send Response
                    </button>
                    <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                      <FaFileAlt className="mr-2" /> Attach Policy Document
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* CGPA Update Request Details */}
            {type === 'cgpa_update' && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-emerald-600" />
                  CGPA Update Request
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="font-medium">{meta.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student ID</p>
                    <p className="font-medium">{meta.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">School</p>
                    <p className="font-medium">{meta.school}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Program</p>
                    <p className="font-medium">{meta.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Batch</p>
                    <p className="font-medium">{meta.batch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Semester</p>
                    <p className="font-medium">{meta.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current CGPA</p>
                    <p className="font-medium">{meta.currentCgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Requested CGPA</p>
                    <p className="font-medium">{meta.requestedCgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Proof Document</p>
                    <div className="flex items-center mt-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg w-fit">
                      <FaFilePdf className="mr-2" />
                      <span>{meta.proofType === 'marksheet' ? 'Marksheet' : 'Proof Document'}</span>
                      <button className="ml-3 text-blue-600 hover:text-blue-800">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Previous Updates</p>
                    <p className="font-medium">{meta.previousUpdates}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => handleCgpaUpdate(selectedNotification.id, 'approve')}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <FaCheck className="mr-2" /> Approve Update
                  </button>
                  <button 
                    onClick={() => handleCgpaUpdate(selectedNotification.id, 'reject')}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <FaTimes className="mr-2" /> Reject Request
                  </button>
                  <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
                    <FaDownload className="mr-2" /> Download Proof
                  </button>
                </div>
              </div>
            )}
            
            {/* Application Review Details */}
            {type === 'application_review' && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  <FaClipboardCheck className="mr-2 text-indigo-600" />
                  Application Review
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="font-medium">{meta.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application ID</p>
                    <p className="font-medium">{meta.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company</p>
                    <p className="font-medium">{meta.company}</p>
                  </div>
                  {/* Application Review Details - Continued */}
<div>
  <p className="text-sm text-gray-600 mb-1">Position</p>
  <p className="font-medium">{meta.position}</p>
</div>
<div>
  <p className="text-sm text-gray-600 mb-1">School</p>
  <p className="font-medium">{meta.school}</p>
</div>
<div>
  <p className="text-sm text-gray-600 mb-1">Program</p>
  <p className="font-medium">{meta.program}</p>
</div>
<div>
  <p className="text-sm text-gray-600 mb-1">Batch</p>
  <p className="font-medium">{meta.batch}</p>
</div>
<div>
  <p className="text-sm text-gray-600 mb-1">CGPA</p>
  <p className="font-medium">{meta.cgpa}</p>
</div>
<div>
  <p className="text-sm text-gray-600 mb-1">Applied On</p>
  <p className="font-medium">{new Date(meta.appliedOn).toLocaleDateString()}</p>
</div>
</div>

<div className="mt-4">
  <p className="text-sm text-gray-600 mb-1">Documents Submitted</p>
  <div className="flex flex-wrap gap-2 mt-1">
    {meta.documents.map((doc, index) => (
      <span key={index} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
        {doc}
      </span>
    ))}
  </div>
</div>

<div className="mt-6">
  <p className="text-sm text-gray-600 mb-1">Current Status</p>
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    meta.status === 'pending_validation' 
      ? 'bg-amber-100 text-amber-800' 
      : 'bg-emerald-100 text-emerald-800'
  }`}>
    {meta.status.replace('_', ' ').toUpperCase()}
  </span>
</div>

<div className="flex gap-3 mt-6">
  <button 
    onClick={() => handleApplicationReview(selectedNotification.id, 'approve')}
    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
  >
    <FaCheck className="mr-2" /> Validate Application
  </button>
  <button 
    onClick={() => handleApplicationReview(selectedNotification.id, 'reject')}
    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200"
  >
    <FaTimes className="mr-2" /> Reject Application
  </button>
  <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
    <FaEye className="mr-2" /> View Full Profile
  </button>
</div>
</div>
)}

{/* Interview Schedule Details */}
{type === 'interview' && (
<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
    <FaCalendarAlt className="mr-2 text-rose-600" />
    Interview Schedule Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p className="text-sm text-gray-600 mb-1">Company</p>
      <p className="font-medium">{meta.company}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Position</p>
      <p className="font-medium">{meta.position}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Interview Date</p>
      <p className="font-medium">{new Date(meta.date).toLocaleDateString()}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Time</p>
      <p className="font-medium">{meta.time}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Duration</p>
      <p className="font-medium">{meta.duration}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Interview Type</p>
      <p className="font-medium">{meta.interviewType}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Panels Required</p>
      <p className="font-medium">{meta.panelsRequired}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Students Shortlisted</p>
      <p className="font-medium">{meta.studentsShortlisted}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Contact Person</p>
      <p className="font-medium">{meta.contactPerson}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Venue</p>
      <p className="font-medium">{meta.venue}</p>
    </div>
  </div>
  
  <div className="mt-4">
    <p className="text-sm text-gray-600 mb-1">Eligible Schools</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {meta.schools.map((school, index) => (
        <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          {school}
        </span>
      ))}
    </div>
  </div>
  
  <div className="mt-4">
    <p className="text-sm text-gray-600 mb-1">Eligible Batches</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {meta.batches.map((batch, index) => (
        <span key={index} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          {batch}
        </span>
      ))}
    </div>
  </div>
  
  <div className="flex gap-3 mt-6">
    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaCheck className="mr-2" /> Confirm Schedule
    </button>
    <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaTimes className="mr-2" /> Request Changes
    </button>
    <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaDownload className="mr-2" /> Download List
    </button>
  </div>
</div>
)}

{/* Admin Coordination Details */}
{type === 'admin_collab' && (
<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
    <FaUsers className="mr-2 text-violet-600" />
    Admin Coordination Request
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p className="text-sm text-gray-600 mb-1">From</p>
      <p className="font-medium">{meta.fromAdmin}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Purpose</p>
      <p className="font-medium">{meta.purpose}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Related Drive</p>
      <p className="font-medium">{meta.relatedDrive}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Students Affected</p>
      <p className="font-medium">{meta.studentsAffected}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Meeting Requested</p>
      <p className="font-medium">{meta.meetingRequested ? 'Yes' : 'No'}</p>
    </div>
    {meta.meetingRequested && (
      <div>
        <p className="text-sm text-gray-600 mb-1">Preferred Time</p>
        <p className="font-medium">{new Date(meta.preferredTime).toLocaleString()}</p>
      </div>
    )}
  </div>
  
  <div className="flex gap-3 mt-6">
    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaCheck className="mr-2" /> Confirm Coordination
    </button>
    <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaTimes className="mr-2" /> Suggest Alternative
    </button>
    <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaCalendarAlt className="mr-2" /> Schedule Meeting
    </button>
  </div>
</div>
)}

{/* Announcement Details */}
{type === 'announcement' && (
<div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
    <FaBell className="mr-2 text-purple-600" />
    Announcement Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p className="text-sm text-gray-600 mb-1">Event</p>
      <p className="font-medium">{meta.event}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Date</p>
      <p className="font-medium">{new Date(meta.date).toLocaleDateString()}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">Coordinator</p>
      <p className="font-medium">{meta.coordinator}</p>
    </div>
  </div>
  
  <div className="mt-4">
    <p className="text-sm text-gray-600 mb-1">Changes Made</p>
    <ul className="list-disc list-inside text-gray-700 pl-2">
      {meta.changes.map((change, index) => (
        <li key={index}>{change}</li>
      ))}
    </ul>
  </div>
  
  <div className="mt-4">
    <p className="text-sm text-gray-600 mb-1">Affected Batches</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {meta.affectedBatches.map((batch, index) => (
        <span key={index} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          {batch}
        </span>
      ))}
    </div>
  </div>
  
  <div className="mt-4">
    <p className="text-sm text-gray-600 mb-1">Affected Schools</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {meta.affectedSchools.map((school, index) => (
        <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          {school}
        </span>
      ))}
    </div>
  </div>
  
  <div className="flex gap-3 mt-6">
    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaCheckCircle className="mr-2" /> Acknowledge
    </button>
    <button className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200">
      <FaShare className="mr-2" /> Share with Departments
    </button>
  </div>
</div>
)}
</div>
</div>
</div>
);
};

return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaBell className="mr-3 text-blue-600" />
          Notifications
        </h1>
        <p className="text-gray-600 mt-2">Manage your placement-related notifications and requests</p>
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notifications..."
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={markAllAsRead}
          className="ml-3 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200"
        >
          <FaCheck className="mr-2" /> Mark all as read
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center transition-all duration-200 ${
            activeFilter === filter.id
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-blue-600'
              : `bg-gradient-to-r ${filter.color} text-gray-700 border-gray-200 shadow-sm hover:shadow-md`
          }`}
        >
          {filter.icon}
          <span className="ml-2">{filter.name}</span>
          {filter.id === 'all' && unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {activeFilter === 'all' ? 'All Notifications' : 
           activeFilter === 'unread' ? 'Unread Notifications' : 
           filters.find(f => f.id === activeFilter)?.name}
          {activeFilter === 'all' && unreadCount > 0 && (
            <span className="ml-2 text-sm text-rose-600">({unreadCount} unread)</span>
          )}
        </h2>
        
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">
              <FaEnvelopeOpen />
            </div>
            <p className="text-gray-500 text-lg">No notifications found</p>
            <p className="text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-5 rounded-xl border transition-all duration-200 ${
                  notification.isRead 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">{notification.message}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getPriorityBadge(notification.priority)}
                        {!notification.isRead && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">From: {notification.from}</span>
                        {notification.enrollmentId && (
                          <span className="ml-3">ID: {notification.enrollmentId}</span>
                        )}
                        <span className="ml-3">{notification.date} at {notification.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {notification.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
                        </button>
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 rounded-full hover:bg-rose-50"
                          title="Delete notification"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {getActionButtons(notification)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  
  {showDetailModal && renderDetailModal()}
</div>
);
};

export default Notifications;