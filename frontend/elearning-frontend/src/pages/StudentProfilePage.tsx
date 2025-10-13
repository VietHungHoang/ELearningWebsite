import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';

const StudentProfilePage: React.FC = () => {
  return (
    <>
      <Header />

      {/* <div className="rbt-page-banner-wrapper"> */}
        {/* Start Banner BG Image  */}
        <div className="rbt-banner-image"></div>
        {/* End Banner BG Image  */}
      {/* </div> */}

      {/* Start Card Style */}
      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <StudentDashboardHeader />

              <div className="row g-5">
                <div className="col-lg-3">
                  <StudentDashboardSidebar activeLink="profile" />
                </div>
                <div className="col-lg-9">
                  {/* Start Instructor Profile  */}
                  <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">My Profile</h4>
                      </div>
                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Registration Date</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">February 25, 2025 6:01 am</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">First Name</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">Emily</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Last Name</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">Hannah</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Username</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">instructor</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Email</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">example@gmail.com</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Phone Number</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">+1-202-555-0174</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Skill/Occupation</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">Application Developer</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}

                      {/* Start Profile Row  */}
                      <div className="rbt-profile-row row row--15 mt--15">
                        <div className="col-lg-4 col-md-4">
                          <div className="rbt-profile-content b2">Biography</div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                          <div className="rbt-profile-content b2">I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences.</div>
                        </div>
                      </div>
                      {/* End Profile Row  */}
                    </div>
                  </div>
                  {/* End Instructor Profile  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Card Style */}

      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentProfilePage;