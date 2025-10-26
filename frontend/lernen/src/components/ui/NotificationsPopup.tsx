import React, { useState, useMemo, useEffect } from 'react';
import notificationsService from '../../services/notificationsService';
import type { Notification } from '../../services/notificationsService';
import Loading from './Loading';

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
  <div 
    onClick={onClick} 
    className={`flex items-start space-x-4 p-2 cursor-pointer rounded-lg transition-colors duration-200 ${
      notification.read 
        ? 'bg-gray-100 hover:bg-gray-150' 
        : 'hover:bg-gray-50'
    }`}
  >
    <MessageIcon isRead={notification.read} />
    <div className="flex-grow">
      <p 
        style={{ color: 'rgba(0, 0, 0, 0.9)' }} 
        className={`${notification.read ? 'font-medium text-gray-600' : 'font-semibold'}`}
      >
        {notification.title}
      </p>
      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-400' : 'text-gray-500'}`}>
        {notification.message}
      </p>
    </div>
    <span className={`text-xs flex-shrink-0 pt-1 ${notification.read ? 'text-gray-400' : 'text-gray-400'}`}>
      {new Date(notification.createdAt).toLocaleDateString()}
    </span>
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
        
        // Sort by createdAt (newest first)
        const sortedItems = items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setNotifications(sortedItems);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []); // Only fetch on mount

  const allRead = useMemo(() => notifications.length > 0 && notifications.every(n => n.read), [notifications]);

  const handleMarkAllAsRead = () => {
    // Always mark all as read (không toggle)
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      return updated;
    });
    
    // Call API to mark all as read in database
    notificationsService.markAllAsRead().catch(error => {
      console.error('Failed to mark all notifications as read:', error);
    });
  };
  
  const handleNotificationClick = (id: string) => {
    setNotifications(
        notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
    // useEffect sẽ tự update count
    
    // Call API to mark as read in database
    notificationsService.markAsRead(id).catch(error => {
      console.error('Failed to mark notification as read:', error);
    });
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const newNotifications = await notificationsService.loadMoreNotifications(currentPage + 1, NOTIFICATIONS_PER_PAGE);
      
      // Merge, deduplicate by ID, and sort by createdAt (newest first)
      const notificationMap = new Map<string, Notification>();
      
      // Add existing notifications
      notifications.forEach(notif => notificationMap.set(notif.id, notif));
      
      // Add new notifications (overwrites if ID exists)
      newNotifications.forEach(notif => notificationMap.set(notif.id, notif));
      
      // Convert to array and sort by createdAt DESC
      const allNotifications = Array.from(notificationMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setNotifications(allNotifications);
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
            disabled={notifications.length === 0 || allRead}
          >
            Mark all as read
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
                    className="w-fit h-8 px-6 rounded-lg text-sm font-semibold hover:bg-[rgba(41,92,81,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#295C51] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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