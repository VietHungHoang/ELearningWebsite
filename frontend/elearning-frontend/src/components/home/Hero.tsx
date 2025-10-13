import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';

const Hero = () => {
  const courses = [
    {
      id: 1,
      title: 'React',
      lessons: 12,
      students: 50,
      price: 70,
      originalPrice: 120,
      discount: '-40%',
      image: '/assets/images/course/course-01.jpg'
    },
    {
      id: 2,
      title: 'JavaScript',
      lessons: 15,
      students: 75,
      price: 80,
      originalPrice: 150,
      discount: '-40%',
      image: '/assets/images/course/classic-lms-01.jpg'
    },
    {
      id: 3,
      title: 'Python',
      lessons: 20,
      students: 100,
      price: 90,
      originalPrice: 180,
      discount: '-50%',
      image: '/assets/images/course/course-online-02.jpg'
    }
  ];

  return (
    <div className="rbt-banner-area rbt-banner-1">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pb--120 pt--70">
            <div className="content">
              <div className="inner">
                <div className="rbt-new-badge rbt-new-badge-one">
                  <span className="rbt-new-badge-icon">🏆</span> The Leader in Online Learning
                </div>

                <h1 className="title">
                  Build The Skills <br /> To Drive Your Career.
                </h1>
                <p className="description">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                  <strong>Velit officia consequat.</strong>
                </p>
                <div className="slider-btn">
                  <a className="rbt-btn btn-gradient hover-icon-reverse" href="/courses">
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">View Course</span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </span>
                  </a>
                </div>
              </div>
              <div className="shape-wrapper" id="scene">
                <img src="/assets/images/banner/banner-01.png" alt="Hero Image" />
                <div className="hero-bg-shape-1 layer" data-depth="0.4">
                  <img src="/assets/images/shape/shape-01.png" alt="Hero Image Background Shape" />
                </div>
                <div className="hero-bg-shape-2 layer" data-depth="0.4">
                  <img src="/assets/images/shape/shape-02.png" alt="Hero Image Background Shape" />
                </div>
              </div>

              {/* Course Carousel */}
              <div className="banner-card pb--60 mb--50 rbt-dot-bottom-center">
                <Swiper
                  effect="cards"
                  grabCursor={true}
                  modules={[EffectCards, Pagination]}
                  pagination={{
                    el: '.rbt-swiper-pagination',
                    clickable: true,
                  }}
                >
                  {courses.map((course) => (
                    <SwiperSlide key={course.id}>
                      <div className="rbt-card variation-01 rbt-hover">
                        <div className="rbt-card-img">
                          <a href={`/course/${course.id}`}>
                            <img src={course.image} alt="Card image" />
                            <div className="rbt-badge-3 bg-white">
                              <span>{course.discount}</span>
                              <span>Off</span>
                            </div>
                          </a>
                        </div>
                        <div className="rbt-card-body">
                          <ul className="rbt-meta">
                            <li><i className="feather-book"></i>{course.lessons} Lessons</li>
                            <li><i className="feather-users"></i>{course.students} Students</li>
                          </ul>
                          <h4 className="rbt-card-title">
                            <a href={`/course/${course.id}`}>{course.title}</a>
                          </h4>
                          <p className="rbt-card-text">
                            It is a long established fact that a reader will be distracted.
                          </p>
                          <div className="rbt-review">
                            <div className="rating">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                            <span className="rating-count"> (15 Reviews)</span>
                          </div>
                          <div className="rbt-card-bottom">
                            <div className="rbt-price">
                              <span className="current-price">${course.price}</span>
                              <span className="off-price">${course.originalPrice}</span>
                            </div>
                            <a className="rbt-btn-link" href={`/course/${course.id}`}>
                              Learn More<i className="feather-arrow-right"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="rbt-swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;