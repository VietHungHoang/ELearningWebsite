import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';
import StudentEnrolledCourses from '../components/dashboard/StudentEnrolledCourses';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';

const StudentEnrolledCoursesPage: React.FC = () => {
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
                  <StudentDashboardSidebar activeLink="enrolled-courses" />
                </div>

                <div className="col-lg-9">
                  <StudentEnrolledCourses />
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

export default StudentEnrolledCoursesPage;