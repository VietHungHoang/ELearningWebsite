import React from 'react';
import { Link } from 'react-router-dom';

const CourseBreadcrumb: React.FC = () => {
  return (
    <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
      <div className="breadcrumb-inner">
        <img src="/assets/images/bg/bg-image-10.jpg" alt="Education Images" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="content text-start">
              <ul className="page-list">
                <li className="rbt-breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <div className="icon-right">
                    <i className="feather-chevron-right"></i>
                  </div>
                </li>
                <li className="rbt-breadcrumb-item active">Web Development</li>
              </ul>
              <h2 className="title">The Complete Histudy 2023: From Zero to Expert!</h2>
              <p className="description">
                Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!
              </p>

              <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                <div className="feature-sin best-seller-badge">
                  <span className="rbt-badge-2">
                    <span className="image">
                      <img src="/assets/images/icons/card-icon-1.png" alt="Best Seller Icon" />
                    </span> Bestseller
                  </span>
                </div>

                <div className="feature-sin rating">
                  <a href="#">4.8</a>
                  <a href="#"><i className="fa fa-star"></i></a>
                  <a href="#"><i className="fa fa-star"></i></a>
                  <a href="#"><i className="fa fa-star"></i></a>
                  <a href="#"><i className="fa fa-star"></i></a>
                  <a href="#"><i className="fa fa-star"></i></a>
                </div>

                <div className="feature-sin total-rating">
                  <a className="rbt-badge-4" href="#">215,475 rating</a>
                </div>

                <div className="feature-sin total-student">
                  <span>616,029 students</span>
                </div>
              </div>

              <div className="rbt-author-meta mb--20">
                <div className="rbt-avater">
                  <a href="#">
                    <img src="/assets/images/client/avatar-02.png" alt="Sophia Jaymes" />
                  </a>
                </div>
                <div className="rbt-author-info">
                  By <Link to="/profile">Angela</Link> In <Link to="#">Development</Link>
                </div>
              </div>

              <ul className="rbt-meta">
                <li><i className="feather-calendar"></i>Last updated 12/2024</li>
                <li><i className="feather-globe"></i>English</li>
                <li><i className="feather-award"></i>Certified Course</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBreadcrumb;