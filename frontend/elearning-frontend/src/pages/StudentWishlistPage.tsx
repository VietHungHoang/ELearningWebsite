import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';
import StudentWishlist from '../components/dashboard/StudentWishlist';

const StudentWishlistPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <StudentDashboardHeader />

              <div className="row g-5">
                <div className="col-lg-3">
                  <StudentDashboardSidebar activeLink="wishlist" />
                </div>

                <div className="col-lg-9">
                  <StudentWishlist />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentWishlistPage;