import React, { useState } from 'react';

const CourseSidebar: React.FC = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const handleShowMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  return (
    <div className="course-sidebar sticky-top rbt-shadow-box course-sidebar-top rbt-gradient-border">
      <div className="inner">

        <a className="video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15" href="https://www.youtube.com/watch?v=nA1Aqp0sPQo">
          <div className="video-content">
            <img className="w-100 rbt-radius" src="/assets/images/others/video-01.jpg" alt="Video Images" />
            <div className="position-to-top">
              <span className="rbt-btn rounded-player-2 with-animation">
                <span className="play-icon"></span>
              </span>
            </div>
            <span className="play-view-text d-block color-white">
              <i className="feather-eye"></i> Preview this course
            </span>
          </div>
        </a>

        <div className="content-item-content">
          <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
            <div className="rbt-price">
              <span className="current-price">$60.99</span>
              <span className="off-price">$84.99</span>
            </div>
            <div className="discount-time">
              <span className="rbt-badge color-danger bg-color-danger-opacity">
                <i className="feather-clock"></i> 3 days left!
              </span>
            </div>
          </div>

          <div className="add-to-card-button mt--15">
            <a className="rbt-btn btn-gradient icon-hover w-100 d-block text-center" href="#">
              <span className="btn-text">Add to Cart</span>
              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
            </a>
          </div>

          <div className="buy-now-btn mt--15">
            <a className="rbt-btn btn-border icon-hover w-100 d-block text-center" href="#">
              <span className="btn-text">Buy Now</span>
              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
            </a>
          </div>

          <span className="subtitle">
            <i className="feather-rotate-ccw"></i> 30-Day Money-Back Guarantee
          </span>

          <div className={`rbt-widget-details has-show-more ${showMoreDetails ? 'active' : ''}`}>
            <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">
              <li><span>Start Date</span><span className="rbt-feature-value rbt-badge-5">5 Hrs 20 Min</span></li>
              <li><span>Enrolled</span><span className="rbt-feature-value rbt-badge-5">100</span></li>
              <li><span>Lectures</span><span className="rbt-feature-value rbt-badge-5">50</span></li>
              <li><span>Skill Level</span><span className="rbt-feature-value rbt-badge-5">Basic</span></li>
              <li><span>Language</span><span className="rbt-feature-value rbt-badge-5">English</span></li>
              <li><span>Quizzes</span><span className="rbt-feature-value rbt-badge-5">10</span></li>
              <li><span>Certificate</span><span className="rbt-feature-value rbt-badge-5">Yes</span></li>
              <li><span>Pass Percentage</span><span className="rbt-feature-value rbt-badge-5">95%</span></li>
            </ul>
            <div className="rbt-show-more-btn" onClick={handleShowMoreDetails}>
              {showMoreDetails ? 'Show Less' : 'Show More'}
            </div>
          </div>

          <div className="social-share-wrapper mt--30 text-center">
            <div className="rbt-post-share d-flex align-items-center justify-content-center">
              <ul className="social-icon social-default transparent-with-border justify-content-center">
                <li><a href="https://www.facebook.com/">
                    <i className="feather-facebook"></i>
                  </a>
                </li>
                <li><a href="https://www.twitter.com">
                    <i className="feather-twitter"></i>
                  </a>
                </li>
                <li><a href="https://www.instagram.com/">
                    <i className="feather-instagram"></i>
                  </a>
                </li>
                <li><a href="https://www.linkdin.com/">
                    <i className="feather-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>
            <hr className="mt--20" />
            <div className="contact-with-us text-center">
              <p>For details about the course</p>
              <p className="rbt-badge-2 mt--10 justify-content-center w-100">
                <i className="feather-phone mr--5"></i> Call Us: <a href="#"><strong>+444 555 666 777</strong></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;