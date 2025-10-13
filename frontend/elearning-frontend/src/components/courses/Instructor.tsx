import React from 'react';
import { Link } from 'react-router-dom';

const Instructor: React.FC = () => {
  return (
    <div className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30" id="intructor">
      <div className="about-author border-0 pb--0 pt--0">
        <div className="section-title mb--30">
          <h4 className="rbt-title-style-3">Instructor</h4>
        </div>
        <div className="media align-items-center">
          <div className="thumbnail">
            <a href="#">
              <img src="/assets/images/testimonial/testimonial-7.jpg" alt="Author Images" />
            </a>
          </div>
          <div className="media-body">
            <div className="author-info">
              <h5 className="title">
                <Link className="hover-flip-item-wrapper" to="/author">B.M. Rafekul Islam</Link>
              </h5>
              <span className="b3 subtitle">Advanced Educator</span>
              <ul className="rbt-meta mb--20 mt--10">
                <li><i className="fa fa-star color-warning"></i>75,237 Reviews <span className="rbt-badge-5 ml--5">4.4 Rating</span></li>
                <li><i className="feather-users"></i>912,970 Students</li>
                <li><Link to="#"><i className="feather-video"></i>16 Courses</Link></li>
              </ul>
            </div>
            <div className="content">
              <p className="description">
                John is a brilliant educator, whose life was spent for computer science and love of nature.
              </p>

              <ul className="social-icon social-default icon-naked justify-content-start">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;