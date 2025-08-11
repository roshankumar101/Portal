// components/NotificationModal.jsx
import React, { useState, useEffect } from 'react';

const NotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - replace with your actual API call
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "New Job Opening: Software Engineer",
        message: "Google is hiring for Software Engineer position",
        timestamp: "2 hours ago",
        type: "job",
        isRead: false
      },
      {
        id: 2,
        title: "Application Status Update",
        message: "Your application for Microsoft has been shortlisted",
        timestamp: "5 hours ago",
        type: "update",
        isRead: false
      },
      {
        id: 3,
        title: "Interview Scheduled",
        message: "Interview scheduled for Amazon SDE role on Aug 15",
        timestamp: "1 day ago",
        type: "interview",
        isRead: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'job': return '💼';
      case 'update': return '📋';
      case 'interview': return '📅';
      default: return '🔔';
    }
  };

  return (
    <>
      {/* Notification Button */}
      <div className='fixed z-50 bottom-[3%] right-[2%]'>
        <button 
          type="button" 
          className='relative size-[3.2rem] bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center'
          onClick={toggleModal}
        >
          {/* Bell Icon */}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2C8.895 2 8 2.895 8 4v2.5C6.145 7.345 5 9.024 5 11v3l-2 2v1h14v-1l-2-2v-3c0-1.976-1.145-3.655-3-4.5V4c0-1.105-.895-2-2-2zm0 16c1.105 0 2-.895 2-2H8c0 1.105.895 2 2 2z"/>
          </svg>
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 transition-all duration-300"
            onClick={toggleModal}
          ></div>
          
          {/* Modal Content */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {/* Modal Header */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Announcements & Notifications
                  </h3>
                  <button
                    onClick={toggleModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-8a4 4 0 118 0v8z" />
                      </svg>
                      No notifications yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            notification.isRead 
                              ? 'bg-gray-50 border-gray-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                notification.isRead ? 'text-gray-900' : 'text-blue-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationModal;
