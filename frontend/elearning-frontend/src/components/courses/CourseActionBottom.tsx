import React from 'react';

const CourseActionBottom: React.FC = () => {
  return (
    <div className="rbt-course-action-bottom">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            <div className="section-title text-center text-md-start">
              <h5 className="title mb--0">The Complete Histudy 2023: From Zero to Expert!</h5>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 mt_sm--15">
            <div className="course-action-bottom-right rbt-single-group">
              <div className="rbt-single-list rbt-price large-size justify-content-center">
                <span className="current-price color-primary">$750.00</span>
                <span className="off-price">$1500.00</span>
              </div>
              <div className="rbt-single-list action-btn">
                <a className="rbt-btn btn-gradient hover-icon-reverse btn-md" href="#">
                  <span className="icon-reverse-wrapper">
                    <span className="btn-text">Purchase Now</span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseActionBottom;