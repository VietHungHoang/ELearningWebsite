import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MyBookingsContent from '../components/MyBookingsContent';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';


const mockSentRequests: any[] = [
    {
        id: 'L001-sent',
        type: 'Lobby Creation',
        tutor: { name: 'Cynthia Hunter', avatar: 'https://picsum.photos/seed/cynthia/48/48' },
        student: { id: 1, name: 'Sarah Chapman', avatar: ''}, // Not needed for this view
        courseTitle: 'Linear Algebra Review',
        proposedSchedules: [{ day: '', time: 'Weekday Evenings (6pm - 9pm)' }],
        reason: 'Focused review of matrix and determinant exercises to prepare for the final exam.',
        maxStudents: 3,
        timestamp: '2 hours ago',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'Pending'
    },
    {
        id: 'T001-sent',
        type: 'Trial',
        tutor: { name: 'Steven Ford', avatar: 'https://picsum.photos/seed/steven/48/48' },
        student: { id: 1, name: 'Sarah Chapman', avatar: ''},
        courseTitle: 'Time Management Mastery',
        proposedSchedules: [{ day: 'Friday', time: '11:00 AM' }],
        reason: "Hi, I'm very interested in your Time Management course.",
        timestamp: '1 day ago',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'Approved'
    },
     {
        id: 'R001-sent',
        type: 'Reschedule',
        tutor: { name: 'Antony Clara', avatar: 'https://picsum.photos/seed/antonyC/48/48' },
        student: { id: 1, name: 'Sarah Chapman', avatar: ''},
        courseTitle: 'Intro to Creative Writing',
        originalSchedule: 'Every Wednesday at 02:00 PM',
        proposedSchedules: [{ day: 'Thursday', time: '04:00 PM' }],
        reason: 'Hi, something came up and I won\'t be able to make our usual Wednesday slot.',
        timestamp: '3 days ago',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'Declined'
    }
];

const ProfileSettingsPage: React.FC = () => {
  const { view } = useParams<{ view: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("My Bookings");
  const [viewingClass, setViewingClass] = useState<any | null>(null);
  const [sentRequests, setSentRequests] = useState<any[]>(mockSentRequests);

  const viewToLabel: Record<string, string> = {
    'profile-settings': 'Profile Settings',
    'my-bookings': 'My Bookings',
    'my-requests': 'My Requests',
    'my-learning': 'My Learning',
    'my-class': 'My Class',
    'my-certificates': 'My Certificates',
    'favourites': 'Favourites',
    'my-quizzes': 'My Quizzes',
    'inbox': 'Inbox',
    'invoices': 'Invoices',
  };

  useEffect(() => {
    const label = view ? viewToLabel[view] || 'My Bookings' : 'My Bookings';
    setActiveView(label);
  }, [view]);

  const pendingRequestsCount = sentRequests.filter(r => r.status === 'Pending').length;

  const handleLogout = () => {
    console.log('Logout');
  };

  const navigateToApp = (page: string) => {
    console.log('Navigate to', page);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Profile Settings':
      case 'My Bookings':
        return <MyBookingsContent />;
      case 'My Requests':
        return <div>My Requests Content</div>;
      case 'My Learning':
        return <div>My Learning Content</div>;
      case 'My Class':
        return <div>My Class Content</div>;
      case 'My Certificates':
        return <div>My Certificates Content</div>;
      case 'Favourites':
        return <div>Favourites Content</div>;
      case 'My Quizzes':
        return <div>My Quizzes Content</div>;
      case 'Inbox':
        return <div>Inbox Content</div>;
      case 'Invoices':
        return <div>Invoices Content</div>;
      default:
        return <MyBookingsContent />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <DashboardSidebar 
        isOpen={isSidebarOpen}
        activeView={activeView}
        onItemClick={(label) => navigate(`/profile/${label.toLowerCase().replace(' ', '-')}`)}
        handleLogout={handleLogout}
        pendingRequestsCount={pendingRequestsCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeView={activeView}
          onItemClick={(label) => navigate(`/profile/${label.toLowerCase().replace(' ', '-')}`)}
          detailViewName={activeView === 'My Class' && viewingClass ? viewingClass.courseTitle : undefined}
          onBackToListView={activeView === 'My Class' && viewingClass ? () => setViewingClass(null) : undefined}
        />
        <main className="flex-1 overflow-y-auto bg-[#F8F7F4] p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;