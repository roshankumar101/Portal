import React, { useState } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaEnvelope, 
  FaCalendarAlt,
  FaBriefcase,
  FaFilter,
  FaTrash,
  FaUserGraduate,
  FaQuestionCircle,
  FaChevronRight,
  FaRegCheckCircle,
  FaRegClock,
  FaSearch,
  FaEye,
  FaReply,
  FaCheckCircle,
  FaPaperPlane,
  FaRegCommentDots
} from 'react-icons/fa';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      type: 'jd_approval',
      title: 'JD Approval Request from Google',
      message: 'Google has submitted a new Job Description for approval. Please review the requirements and compensation details.',
      from: 'Sarah Johnson (Recruiter)',
      time: '10:45 AM',
      date: 'Mar 12, 2023',
      isRead: false,
      priority: 'high',
      meta: { company: 'Google', jdId: 'JD-12345' }
    },
    {
      id: 2,
      type: 'student_query',
      title: 'Question from Student',
      message: 'Rahul Sharma asked: "What is the deadline for Microsoft applications and whether there are any specific requirements for the coding test?"',
      from: 'Rahul Sharma (SOT, CSE)',
      time: '09:30 AM',
      date: 'Mar 12, 2023',
      isRead: false,
      priority: 'medium',
      meta: { studentId: 'STU-789', queryId: 'QRY-456' }
    },
    {
      id: 3,
      type: 'application_update',
      title: 'Application Status Update',
      message: 'Your application for Frontend Developer at Amazon has been shortlisted for the next round of interviews.',
      from: 'Amazon Recruitment Team',
      time: '03:15 PM',
      date: 'Mar 11, 2023',
      isRead: true,
      priority: 'medium',
      meta: { company: 'Amazon', status: 'shortlisted', appId: 'APP-67890' }
    },
    {
      id: 4,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Your interview with Microsoft has been scheduled for March 15, 2023 at 2:00 PM. The interview will be conducted virtually via Microsoft Teams.',
      from: 'Microsoft HR Department',
      time: '11:20 AM',
      date: 'Mar 11, 2023',
      isRead: true,
      priority: 'high',
      meta: { company: 'Microsoft', date: '2023-03-15', time: '14:00' }
    },
    {
      id: 5,
      type: 'student_query',
      title: 'Question from Student',
      message: 'Priya Singh asked: "Can I apply for multiple roles at the same company? What is the policy regarding multiple applications?"',
      from: 'Priya Singh (SOM, ECE)',
      time: '04:45 PM',
      date: 'Mar 10, 2023',
      isRead: true,
      priority: 'low',
      meta: { studentId: 'STU-456', queryId: 'QRY-789' }
    },
    {
      id: 6,
      type: 'announcement',
      title: 'Placement Drive Announcement',
      message: 'Annual placement drive will be held on March 20-22, 2023. All students must complete their profiles and upload latest resumes by March 15.',
      from: 'Placement Cell',
      time: '02:30 PM',
      date: 'Mar 10, 2023',
      isRead: true,
      priority: 'high',
      meta: { event: 'Annual Placement Drive', date: '2023-03-20' }
    }
  ];

  const filters = [
    { id: 'all', name: 'All', icon: <FaBell />, color: 'from-blue-50 to-blue-100' },
    { id: 'unread', name: 'Unread', icon: <FaEnvelope />, color: 'from-purple-50 to-purple-100' },
    { id: 'jd_approval', name: 'JD Approvals', icon: <FaBriefcase />, color: 'from-amber-50 to-amber-100' },
    { id: 'student_query', name: 'Student Queries', icon: <FaQuestionCircle />, color: 'from-teal-50 to-teal-100' },
    { id: 'application_update', name: 'Applications', icon: <FaUserGraduate />, color: 'from-indigo-50 to-indigo-100' },
    { id: 'interview', name: 'Interviews', icon: <FaCalendarAlt />, color: 'from-rose-50 to-rose-100' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'unread' ? !notification.isRead : 
                         notification.type === activeFilter);
    
    const matchesSearch = searchQuery === '' || 
                         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.from.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    // Implementation for marking as read
    console.log(`Mark notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // Implementation for marking all as read
    console.log('Mark all as read');
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="px-2.5 py-1 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 text-xs font-medium rounded-full border border-rose-200">High Priority</span>;
      case 'medium': return <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-medium rounded-full border border-amber-200">Medium Priority</span>;
      case 'low': return <span className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium rounded-full border border-blue-200">Low Priority</span>;
      default: return null;
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'jd_approval': return <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 rounded-xl border border-amber-200"><FaBriefcase className="text-lg" /></div>;
      case 'student_query': return <div className="p-2.5 bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 rounded-xl border border-teal-200"><FaRegCommentDots className="text-lg" /></div>;
      case 'application_update': return <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl border border-indigo-200"><FaUserGraduate className="text-lg" /></div>;
      case 'interview': return <div className="p-2.5 bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 rounded-xl border border-rose-200"><FaCalendarAlt className="text-lg" /></div>;
      case 'announcement': return <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 rounded-xl border border-purple-200"><FaBell className="text-lg" /></div>;
      default: return <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl border border-gray-200"><FaEnvelope className="text-lg" /></div>;
    }
  };

  const getActionButtons = (type, id) => {
    switch(type) {
      case 'jd_approval':
        return (
          <div className="flex space-x-3 mt-4">
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200">
              <FaCheck className="mr-2" /> Approve JD
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border border-rose-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200">
              <FaTimes className="mr-2" /> Request Changes
            </button>
          </div>
        );
      case 'student_query':
        return (
          <div className="flex space-x-3 mt-4">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200">
              <FaReply className="mr-2" /> Reply to Student
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200">
              <FaPaperPlane className="mr-2" /> Send Resources
            </button>
          </div>
        );
      default:
        return (
          <button className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200 text-sm font-medium rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200 mt-4">
            View Details
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl border border-blue-200 shadow-sm mr-4">
                <FaBell className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 
                    ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
                    : 'All caught up!'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent w-full md:w-64 bg-white"
                />
              </div>
              
              <button 
                onClick={markAllAsRead}
                className="px-5 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200 font-medium rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FaCheckCircle className="mr-2" /> Mark all as read
              </button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-3">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-xl flex items-center whitespace-nowrap transition-all duration-200 border ${
                    activeFilter === filter.id 
                      ? `bg-gradient-to-r ${filter.color} text-gray-800 border-gray-200 shadow-inner font-medium` 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <FaBell className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600">No notifications found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery ? 'Try adjusting your search query' : 'You’re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-6 transition-all duration-200 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-800 text-lg">{notification.title}</h3>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                New
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">From: {notification.from}</span>
                            <span className="mx-2">•</span>
                            <span>{notification.date} at {notification.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 rounded-xl transition-all duration-200 border border-gray-200"
                              title="Mark as read"
                            >
                              <FaEye />
                            </button>
                          )}
                          <button 
                            className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-rose-50 hover:to-rose-100 hover:text-rose-600 rounded-xl transition-all duration-200 border border-gray-200"
                            title="Delete notification"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {getActionButtons(notification.type, notification.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;