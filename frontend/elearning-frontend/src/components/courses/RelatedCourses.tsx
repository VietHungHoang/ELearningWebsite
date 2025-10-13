import React from 'react';
import { Link } from 'react-router-dom';

const RelatedCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      rating: 5,
      reviews: 5,
      lessons: 8,
      students: 30,
      price: 80,
      originalPrice: 100,
      instructor: 'Slaughter',
      category: 'Languages',
      avatar: '/assets/images/client/avatar-03.png',
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      discount: 10
    },
    {
      id: 2,
      title: 'Web Front To Back',
      image: '/assets/images/course/course-online-04.jpg',
      rating: 5,
      reviews: 15,
      lessons: 20,
      students: 40,
      price: 60,
      originalPrice: 120,
      instructor: 'Patrick',
      category: 'Languages',
      avatar: '/assets/images/client/avater-01.png',
      description: 'Web Js long fact that a reader will be distracted by the readable.',
      discount: 40
    },
    {
      id: 3,
      title: 'SQL Beginner Advanced',
      image: '/assets/images/course/course-online-05.jpg',
      rating: 5,
      reviews: 15,
      lessons: 12,
      students: 50,
      price: 60,
      originalPrice: 120,
      instructor: 'Angela',
      category: 'Development',
      avatar: '/assets/images/client/avatar-02.png',
      description: 'It is a long established fact that a reader will be distracted by the readable.',
      discount: 20,
      hasCartButton: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`fas fa-star ${index < rating ? '' : 'text-muted'}`}></i>
    ));
  };

  return (
    <div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">
      <div className="container">
        <div className="section-title mb--30">
          <span className="subtitle bg-primary-opacity">More Similar Courses</span>
          <h4 className="title">Related Courses</h4>
        </div>
        <div className="row g-5">
          {courses.map((course) => (
            <div key={course.id} className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="rbt-card variation-01 rbt-hover">
                <div className="rbt-card-img">
                  <Link to="/course-details">
                    <img src={course.image} alt="Card image" />
                    {course.discount && (
                      <div className="rbt-badge-3 bg-white">
                        <span>-{course.discount}%</span>
                        <span>Off</span>
                      </div>
                    )}
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

                  <p className="rbt-card-text">{course.description}</p>
                  <div className="rbt-author-meta mb--20">
                    <div className="rbt-avater">
                      <Link to="/profile">
                        <img src={course.avatar} alt="Sophia Jaymes" />
                      </Link>
                    </div>
                    <div className="rbt-author-info">
                      By <Link to="/profile">{course.instructor}</Link> In <Link to="#">{course.category}</Link>
                    </div>
                  </div>
                  <div className="rbt-card-bottom">
                    <div className="rbt-price">
                      <span className="current-price">${course.price}</span>
                      <span className="off-price">${course.originalPrice}</span>
                    </div>
                    {course.hasCartButton ? (
                      <a className="rbt-btn-link left-icon" href="#">
                        <i className="feather-shopping-cart"></i> Add To Cart
                      </a>
                    ) : (
                      <Link className="rbt-btn-link" to="/course-details">
                        Learn More<i className="feather-arrow-right"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedCourses;