import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';

const StudentOrderHistoryPage: React.FC = () => {
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
                  <StudentDashboardSidebar activeLink="order-history" />
                </div>

                <div className="col-lg-9">
                  {/* Start Order History */}
                  <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">Order History</h4>
                      </div>

                      <div className="rbt-dashboard-table table-responsive mobile-table-750">
                        <table className="rbt-table table table-borderless">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Course Name</th>
                              <th>Date</th>
                              <th>Price</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <th>#5478</th>
                              <td>App Development</td>
                              <td>January 27, 2023</td>
                              <td>$100.99</td>
                              <td><span className="rbt-badge-5 bg-color-success-opacity color-success">Success</span></td>
                            </tr>
                            <tr>
                              <th>#4585</th>
                              <td>Graphic</td>
                              <td>May 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-primary-opacity">Processing</span></td>
                            </tr>
                            <tr>
                              <th>#9656</th>
                              <td>Graphic</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-warning-opacity color-warning">On Hold</span></td>
                            </tr>
                            <tr>
                              <th>#2045</th>
                              <td>Application</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-danger-opacity color-danger">Canceled</span></td>
                            </tr>
                            <tr>
                              <th>#5478</th>
                              <td>App Development</td>
                              <td>January 27, 2023</td>
                              <td>$100.99</td>
                              <td><span className="rbt-badge-5 bg-color-success-opacity color-success">Success</span></td>
                            </tr>
                            <tr>
                              <th>#4585</th>
                              <td>Graphic</td>
                              <td>May 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-primary-opacity">Processing</span></td>
                            </tr>
                            <tr>
                              <th>#9656</th>
                              <td>Graphic</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-warning-opacity color-warning">On Hold</span></td>
                            </tr>
                            <tr>
                              <th>#2045</th>
                              <td>Application</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-danger-opacity color-danger">Canceled</span></td>
                            </tr>
                            <tr>
                              <th>#5478</th>
                              <td>App Development</td>
                              <td>January 27, 2023</td>
                              <td>$100.99</td>
                              <td><span className="rbt-badge-5 bg-color-success-opacity color-success">Success</span></td>
                            </tr>
                            <tr>
                              <th>#4585</th>
                              <td>Graphic</td>
                              <td>May 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-primary-opacity">Processing</span></td>
                            </tr>
                            <tr>
                              <th>#9656</th>
                              <td>Graphic</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-warning-opacity color-warning">On Hold</span></td>
                            </tr>
                            <tr>
                              <th>#2045</th>
                              <td>Application</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-danger-opacity color-danger">Canceled</span></td>
                            </tr>
                            <tr>
                              <th>#5478</th>
                              <td>App Development</td>
                              <td>January 27, 2023</td>
                              <td>$100.99</td>
                              <td><span className="rbt-badge-5 bg-color-success-opacity color-success">Success</span></td>
                            </tr>
                            <tr>
                              <th>#4585</th>
                              <td>Graphic</td>
                              <td>May 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-primary-opacity">Processing</span></td>
                            </tr>
                            <tr>
                              <th>#9656</th>
                              <td>Graphic</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-warning-opacity color-warning">On Hold</span></td>
                            </tr>
                            <tr>
                              <th>#2045</th>
                              <td>Application</td>
                              <td>March 27, 2023</td>
                              <td>$200.99</td>
                              <td><span className="rbt-badge-5 bg-color-danger-opacity color-danger">Canceled</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* End Order History */}
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

export default StudentOrderHistoryPage;