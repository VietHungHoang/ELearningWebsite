import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentEnrolledCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState('enrolled');

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      rating: 5,
      reviews: 15,
      lessons: 20,
      students: 40,
      progress: 90
    },
    {
      id: 2,
      title: 'PHP Beginner + Advanced',
      image: '/assets/images/course/course-online-02.jpg',
      rating: 5,
      reviews: 15,
      lessons: 10,
      students: 30,
      progress: 40
    },
    {
      id: 3,
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      rating: 5,
      reviews: 4,
      lessons: 14,
      students: 26,
      progress: 65
    }
  ];

  const activeCourses = [
    {
      id: 4,
      title: 'English Language Club',
      image: '/assets/images/course/course-online-04.jpg',
      rating: 5,
      reviews: 3,
      lessons: 20,
      students: 30,
      price: 40,
      originalPrice: 86
    },
    {
      id: 5,
      title: 'Graphic Courses Club',
      image: '/assets/images/course/course-online-06.jpg',
      rating: 5,
      reviews: 3,
      lessons: 50,
      students: 10,
      price: 40,
      originalPrice: 86
    },
    {
      id: 6,
      title: 'Web Design Club',
      image: '/assets/images/course/course-online-05.jpg',
      rating: 5,
      reviews: 3,
      lessons: 20,
      students: 30,
      price: 40,
      originalPrice: 86
    }
  ];

  const completedCourses = [
    {
      id: 1,
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      rating: 5,
      reviews: 15,
      lessons: 20,
      students: 40,
      progress: 100
    },
    {
      id: 2,
      title: 'PHP Beginner + Advanced',
      image: '/assets/images/course/course-online-02.jpg',
      rating: 5,
      reviews: 15,
      lessons: 10,
      students: 30,
      progress: 100
    },
    {
      id: 3,
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      rating: 5,
      reviews: 4,
      lessons: 14,
      students: 26,
      progress: 100
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`fas fa-star ${index < rating ? '' : 'text-muted'}`}></i>
    ));
  };

  const renderCourseCard = (course: any, showProgress = false, showPrice = false) => (
    <div key={course.id} className="col-lg-4 col-md-6 col-12">
      <div className="rbt-card variation-01 rbt-hover">
        <div className="rbt-card-img">
          <Link to="/course-details">
            <img src={course.image} alt="Card image" />
          </Link>
        </div>
        <div className="rbt-card-body">
          <div className="rbt-card-top">
            <div className="rbt-review">
              <div className="rating">
                {renderStars(course.rating)}
              </div>
              <span className="rating-count"> ({course.reviews} Reviews)</span>
            </div>
            <div className="rbt-bookmark-btn">
              <a className="rbt-round-btn" title="Bookmark" href="#">
                <i className="feather-bookmark"></i>
              </a>
            </div>
          </div>
          <h4 className="rbt-card-title">
            <Link to="/course-details">{course.title}</Link>
          </h4>
          <ul className="rbt-meta">
            <li><i className="feather-book"></i>{course.lessons} Lessons</li>
            <li><i className="feather-users"></i>{course.students} Students</li>
          </ul>

          {showProgress && (
            <div className="rbt-progress-style-1 mb--20 mt--10">
              <div className="single-progress">
                <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                <div className="progress">
                  <div
                    className="progress-bar wow fadeInLeft bar-color-success"
                    style={{ width: `${course.progress}%` }}
                    role="progressbar"
                    aria-valuenow={course.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                  </div>
                  <span className="rbt-title-style-2 progress-number">{course.progress}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="rbt-card-bottom">
            {showPrice ? (
              <>
                <div className="rbt-price">
                  <span className="current-price">${course.price}</span>
                  <span className="off-price">${course.originalPrice}</span>
                </div>
                <Link className="rbt-btn-link" to="/course-details">
                  Learn More<i className="feather-arrow-right"></i>
                </Link>
              </>
            ) : (
              <a className="rbt-btn btn-sm bg-primary-opacity w-100 text-center" href="#">
                Download Certificate
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
      <div className="content">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Enrolled Courses</h4>
        </div>

        <div className="advance-tab-button mb--30">
          <ul className="nav nav-tabs tab-button-style-2 justify-content-start" role="tablist">
            <li role="presentation">
              <a
                href="#enrolled"
                className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('enrolled');
                }}
                role="tab"
                aria-controls="enrolled"
                aria-selected={activeTab === 'enrolled'}
              >
                <span className="title">Enrolled Courses</span>
              </a>
            </li>
            <li role="presentation">
              <a
                href="#active"
                className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('active');
                }}
                role="tab"
                aria-controls="active"
                aria-selected={activeTab === 'active'}
              >
                <span className="title">Active Courses</span>
              </a>
            </li>
            <li role="presentation">
              <a
                href="#completed"
                className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('completed');
                }}
                role="tab"
                aria-controls="completed"
                aria-selected={activeTab === 'completed'}
              >
                <span className="title">Completed Courses</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === 'enrolled' ? 'active show' : ''}`} role="tabpanel">
            <div className="row g-5">
              {enrolledCourses.map(course => renderCourseCard(course, true))}
            </div>
          </div>

          <div className={`tab-pane fade ${activeTab === 'active' ? 'active show' : ''}`} role="tabpanel">
            <div className="row g-5">
              {activeCourses.map(course => renderCourseCard(course, false, true))}
            </div>
          </div>

          <div className={`tab-pane fade ${activeTab === 'completed' ? 'active show' : ''}`} role="tabpanel">
            <div className="row g-5">
              {completedCourses.map(course => renderCourseCard(course, true))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;