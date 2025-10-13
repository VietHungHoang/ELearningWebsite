import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';

const StudentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

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
                  <StudentDashboardSidebar activeLink="settings" />
                </div>

                <div className="col-lg-9">
                  {/* Start Settings */}
                  <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">Settings</h4>
                      </div>

                      <div className="advance-tab-button mb--30">
                        <ul className="nav nav-tabs tab-button-style-2 justify-content-start" role="tablist">
                          <li role="presentation">
                            <a
                              href="#"
                              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab('profile');
                              }}
                              role="tab"
                              aria-selected={activeTab === 'profile'}
                            >
                              <span className="title">Profile</span>
                            </a>
                          </li>
                          <li role="presentation">
                            <a
                              href="#"
                              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab('password');
                              }}
                              role="tab"
                              aria-selected={activeTab === 'password'}
                            >
                              <span className="title">Password</span>
                            </a>
                          </li>
                          <li role="presentation">
                            <a
                              href="#"
                              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab('social');
                              }}
                              role="tab"
                              aria-selected={activeTab === 'social'}
                            >
                              <span className="title">Social Share</span>
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="tab-content">
                        {activeTab === 'profile' && (
                          <div className="tab-pane fade active show" role="tabpanel">
                            <div className="rbt-dashboard-content-wrapper">
                              <div className="tutor-bg-photo bg_image bg_image--23 height-245"></div>
                              {/* Start Tutor Information */}
                              <div className="rbt-tutor-information">
                                <div className="rbt-tutor-information-left">
                                  <div className="thumbnail rbt-avatars size-lg position-relative">
                                    <img src="assets/images/team/avatar-2.jpg" alt="Instructor" />
                                    <div className="rbt-edit-photo-inner">
                                      <button className="rbt-edit-photo" title="Upload Photo">
                                        <i className="feather-camera"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="rbt-tutor-information-right">
                                  <div className="tutor-btn">
                                    <a className="rbt-btn btn-sm btn-border color-white radius-round-10" href="#">Edit Cover Photo</a>
                                  </div>
                                </div>
                              </div>
                              {/* End Tutor Information */}
                            </div>
                            {/* Start Profile Row */}
                            <form action="#" className="rbt-profile-row rbt-default-form row row--15">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="firstname">First Name</label>
                                  <input id="firstname" type="text" defaultValue="John" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="lastname">Last Name</label>
                                  <input id="lastname" type="text" defaultValue="Due" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="username">User Name</label>
                                  <input id="username" type="text" defaultValue="johndue" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="phonenumber">Phone Number</label>
                                  <input id="phonenumber" type="tel" defaultValue="+1-202-555-0174" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="skill">Skill/Occupation</label>
                                  <input id="skill" type="text" defaultValue="Full Stack Developer" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="filter-select rbt-modern-select">
                                  <label htmlFor="displayname">Display name publicly as</label>
                                  <select id="displayname" className="w-100" defaultValue="Emily Hannah">
                                    <option>Emily Hannah</option>
                                    <option>John</option>
                                    <option>Due</option>
                                    <option>Due John</option>
                                    <option>johndue</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="bio">Bio</label>
                                  <textarea
                                    id="bio"
                                    cols={20}
                                    rows={5}
                                    defaultValue="I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences."
                                  />
                                </div>
                              </div>
                              <div className="col-12 mt--20">
                                <div className="rbt-form-group">
                                  <a className="rbt-btn btn-gradient" href="#">Update Info</a>
                                </div>
                              </div>
                            </form>
                            {/* End Profile Row */}
                          </div>
                        )}

                        {activeTab === 'password' && (
                          <div className="tab-pane fade active show" role="tabpanel">
                            {/* Start Profile Row */}
                            <form action="#" className="rbt-profile-row rbt-default-form row row--15">
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="currentpassword">Current Password</label>
                                  <input id="currentpassword" type="password" placeholder="Current Password" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="newpassword">New Password</label>
                                  <input id="newpassword" type="password" placeholder="New Password" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="retypenewpassword">Re-type New Password</label>
                                  <input id="retypenewpassword" type="password" placeholder="Re-type New Password" />
                                </div>
                              </div>
                              <div className="col-12 mt--10">
                                <div className="rbt-form-group">
                                  <a className="rbt-btn btn-gradient" href="#">Update Password</a>
                                </div>
                              </div>
                            </form>
                            {/* End Profile Row */}
                          </div>
                        )}

                        {activeTab === 'social' && (
                          <div className="tab-pane fade active show" role="tabpanel">
                            {/* Start Profile Row */}
                            <form action="#" className="rbt-profile-row rbt-default-form row row--15">
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="facebook"><i className="feather-facebook"></i> Facebook</label>
                                  <input id="facebook" type="text" placeholder="https://facebook.com/" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="twitter"><i className="feather-twitter"></i> Twitter</label>
                                  <input id="twitter" type="text" placeholder="https://twitter.com/" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="linkedin"><i className="feather-linkedin"></i> Linkedin</label>
                                  <input id="linkedin" type="text" placeholder="https://linkedin.com/" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="website"><i className="feather-globe"></i> Website</label>
                                  <input id="website" type="text" placeholder="https://website.com/" />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="rbt-form-group">
                                  <label htmlFor="github"><i className="feather-github"></i> Github</label>
                                  <input id="github" type="text" placeholder="https://github.com/" />
                                </div>
                              </div>
                              <div className="col-12 mt--10">
                                <div className="rbt-form-group">
                                  <a className="rbt-btn btn-gradient" href="#">Update Profile</a>
                                </div>
                              </div>
                            </form>
                            {/* End Profile Row */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* End Settings */}
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

export default StudentSettingsPage;