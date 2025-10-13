import React from 'react';
import { Link } from 'react-router-dom';

interface StudentDashboardSidebarProps {
  activeLink?: string;
}

const StudentDashboardSidebar: React.FC<StudentDashboardSidebarProps> = ({ activeLink = 'enrolled-courses' }) => {
  return (
    <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
      <div className="inner">
        <div className="content-item-content">
          <div className="rbt-default-sidebar-wrapper">
            <div className="section-title mb--20">
              <h6 className="rbt-title-style-2">Welcome, Jone Due</h6>
            </div>
            <nav className="mainmenu-nav">
              <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                <li><Link to="/student-dashboard" className={activeLink === 'dashboard' ? 'active' : ''}><i className="feather-home"></i><span>Dashboard</span></Link></li>
                <li><Link to="/student-profile" className={activeLink === 'profile' ? 'active' : ''}><i className="feather-user"></i><span>My Profile</span></Link></li>
                <li><Link to="/student-enrolled-courses" className={activeLink === 'enrolled-courses' ? 'active' : ''}><i className="feather-book-open"></i><span>Enrolled Courses</span></Link></li>
                <li><Link to="/student-wishlist" className={activeLink === 'wishlist' ? 'active' : ''}><i className="feather-bookmark"></i><span>Wishlist</span></Link></li>
                <li><Link to="/student-reviews" className={activeLink === 'reviews' ? 'active' : ''}><i className="feather-star"></i><span>Reviews</span></Link></li>
                <li><Link to="/student-my-quiz-attempts" className={activeLink === 'quiz-attempts' ? 'active' : ''}><i className="feather-help-circle"></i><span>My Quiz Attempts</span></Link></li>
                <li><Link to="/student-order-history" className={activeLink === 'order-history' ? 'active' : ''}><i className="feather-shopping-bag"></i><span>Order History</span></Link></li>
              </ul>
            </nav>

            <div className="section-title mt--40 mb--20">
              <h6 className="rbt-title-style-2">User</h6>
            </div>

            <nav className="mainmenu-nav">
              <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                <li><Link to="/student-settings" className={activeLink === 'settings' ? 'active' : ''}><i className="feather-settings"></i><span>Settings</span></Link></li>
                <li><Link to="/"><i className="feather-log-out"></i><span>Logout</span></Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;