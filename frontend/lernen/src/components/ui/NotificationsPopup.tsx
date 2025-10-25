import React, { useState, useMemo, useEffect } from 'react';
import notificationsService from '../../services/notificationsService';
import type { Notification } from '../../services/notificationsService';
import Loading from './Loading';

// Initial mock data is empty, will be loaded on demand.
const initialNotifications: Notification[] = [];

const NOTIFICATIONS_PER_PAGE = 3; // Number of notifications to load at a time

// Message Icon component
const MessageIcon: React.FC<{ isRead: boolean }> = ({ isRead }) => (
  <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${isRead ? 'bg-gray-200' : 'bg-[#E0F2F1]'}`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
        stroke={isRead ? '#6B7280' : '#00796B'} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
    </svg>
  </div>
);

// Notification item component
const NotificationItem: React.FC<{ notification: Notification; onClick: () => void }> = ({ notification, onClick }) => (
  <div onClick={onClick} className="flex items-start space-x-4 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <MessageIcon isRead={notification.isRead} />
    <div className="flex-grow">
      <p 
        style={{ color: 'rgba(0, 0, 0, 0.9)' }} 
        className={`${notification.isRead ? 'font-medium' : 'font-semibold'}`}
      >
        New Message from {notification.sender}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        New message from {notification.sender}. Goto messages to respond.
      </p>
    </div>
    <span className="text-xs text-gray-400 flex-shrink-0 pt-1">{notification.time}</span>
  </div>
);

// Main Notifications Popup component
const NotificationsPopup: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const items = await notificationsService.getNotifications();
        setNotifications(items);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const allRead = useMemo(() => notifications.length > 0 && notifications.every(n => n.isRead), [notifications]);

  const handleMarkAllAsRead = () => {
    const markAsRead = !allRead;
    setNotifications(
      notifications.map(n => ({ ...n, isRead: markAsRead }))
    );
  };
  
  const handleNotificationClick = (id: number) => {
    setNotifications(
        notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const newNotifications = await notificationsService.loadMoreNotifications(currentPage + 1, NOTIFICATIONS_PER_PAGE);
      setNotifications(prev => [...prev, ...newNotifications]);
      setCurrentPage(prev => prev + 1);
      if (newNotifications.length < NOTIFICATIONS_PER_PAGE) {
        setCanLoadMore(false);
      }
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-100 font-sans animate-dropdown-in">
      <div className="p-4">
        {/* Header */}
        <header className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-[#0b6459] hover:text-[#084c43] transition-colors"
            disabled={notifications.length === 0}
          >
            {allRead ? 'Mark all as unread' : 'Mark all as read'}
          </button>
        </header>

        {/* Notification List with scrollbar */}
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto custom-scrollbar -mx-2 px-2 mt-1">
          {isLoading ? (
            <div className="flex items-center justify-center text-center py-20">
              <Loading />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif.id} className="py-2">
                  <NotificationItem 
                      notification={notif} 
                      onClick={() => handleNotificationClick(notif.id)}
                  />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-center py-20">
              <p className="text-gray-500">You have no new notifications.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {canLoadMore && (
            <footer className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      backgroundColor: 'rgba(41, 92, 81, 0.08)',
                      color: '#295C51'
                    }}
                    className="w-fit h-8 px-6 rounded-lg text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#295C51] transition-opacity flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoadingMore ? (
                      <>
                        <Loading size={16} className="mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                </button>
            </footer>
        )}
      </div>
    </div>
  );
}

export default NotificationsPopup;