import { useState } from 'react';

const Courses = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);

  const courses = [
    {
      id: 1,
      image: '/assets/images/course/course-01.jpg',
      discount: '-50%',
      rating: 5,
      reviews: 15,
      title: 'React Front To Back',
      lessons: 20,
      students: 40,
      description: 'React Js long fact that a reader will be distracted by the readable.',
      author: 'Patrick',
      category: 'Languages',
      currentPrice: 60,
      originalPrice: 120,
      isAddToCart: false,
    },
    {
      id: 2,
      image: '/assets/images/course/course-02.jpg',
      discount: '-40%',
      rating: 5,
      reviews: 15,
      title: 'PHP Beginner + Advanced',
      lessons: 12,
      students: 50,
      description: 'It is a long established fact that a reader will be distracted by the readable.',
      author: 'Angela',
      category: 'Development',
      currentPrice: 60,
      originalPrice: 120,
      isAddToCart: true,
    },
    {
      id: 3,
      image: '/assets/images/course/course-03.jpg',
      discount: '-40%',
      rating: 5,
      reviews: 5,
      title: 'Angular Zero to Mastery',
      lessons: 8,
      students: 30,
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      author: 'Slaughter',
      category: 'Languages',
      currentPrice: 80,
      originalPrice: 100,
      isAddToCart: false,
    },
    // Add more courses if needed for load more functionality
  ];

  const handleLoadMore = () => {
    setVisibleCourses(prev => prev + 3);
  };

  return (
    <div className="rbt-course-area bg-color-extra2 rbt-section-gap">
      <div className="container">
        <div className="row mb--60">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <span className="subtitle bg-secondary-opacity">Top Popular Course</span>
              <h2 className="title">Histudy Course student <br /> can join with us.</h2>
            </div>
          </div>
        </div>

        {/* Start Card Area */}
        <div className="row g-5">
          {courses.slice(0, visibleCourses).map((course) => (
            <div key={course.id} className="col-lg-4 col-md-6 col-12">
              <div className="rbt-card variation-01 rbt-hover">
                <div className="rbt-card-img">
                  <a href="course-details.html">
                    <img src={course.image} alt="Card image" />
                    <div className="rbt-badge-3 bg-white">
                      <span>{course.discount}</span>
                      <span>Off</span>
                    </div>
                  </a>
                </div>
                <div className="rbt-card-body">
                  <div className="rbt-card-top">
                    <div className="rbt-review">
                      <div className="rating">
                        {[...Array(course.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
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
                    <a href="course-details.html">{course.title}</a>
                  </h4>
                  <ul className="rbt-meta">
                    <li><i className="feather-book"></i>{course.lessons} Lessons</li>
                    <li><i className="feather-users"></i>{course.students} Students</li>
                  </ul>
                  <p className="rbt-card-text">{course.description}</p>
                  <div className="rbt-author-meta mb--20">
                    <div className="rbt-avater">
                      <a href="#">
                        <img src={`/assets/images/client/avater-0${course.id}.png`} alt={course.author} />
                      </a>
                    </div>
                    <div className="rbt-author-info">
                      By <a href="profile.html">{course.author}</a> In <a href="#">{course.category}</a>
                    </div>
                  </div>

                  <div className="rbt-card-bottom">
                    <div className="rbt-price">
                      <span className="current-price">${course.currentPrice}</span>
                      <span className="off-price">${course.originalPrice}</span>
                    </div>
                    <a className={`rbt-btn-link ${course.isAddToCart ? 'left-icon' : ''}`} href="course-details.html">
                      {course.isAddToCart ? (
                        <>
                          <i className="feather-shopping-cart"></i> Add To Cart
                        </>
                      ) : (
                        <>
                          Learn More<i className="feather-arrow-right"></i>
                        </>
                      )}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* End Card Area */}

        <div className="row">
          <div className="col-lg-12">
            <div className="load-more-btn mt--60 text-center">
              <a className="rbt-btn btn-gradient btn-lg hover-icon-reverse" href="#" onClick={(e) => { e.preventDefault(); handleLoadMore(); }}>
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">Load More Course ({courses.length - visibleCourses})</span>
                  <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;