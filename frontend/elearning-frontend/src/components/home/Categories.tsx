import React from 'react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: 'Web Design',
      courses: 25,
      icon: '/assets/images/category/web-design.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 2,
      title: 'Graphic Design',
      courses: 30,
      icon: '/assets/images/category/design.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 3,
      title: 'Personal Development',
      courses: 20,
      icon: '/assets/images/category/personal.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 4,
      title: 'IT and Software',
      courses: 15,
      icon: '/assets/images/category/server.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 5,
      title: 'Sales Marketing',
      courses: 15,
      icon: '/assets/images/category/pantone.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 6,
      title: 'Art & Humanities',
      courses: 15,
      icon: '/assets/images/category/paint-palette.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 7,
      title: 'Mobile Application',
      courses: 15,
      icon: '/assets/images/category/smartphone.png',
      link: '/course-filter-one-toggle'
    },
    {
      id: 8,
      title: 'Finance & Accounting',
      courses: 15,
      icon: '/assets/images/category/infographic.png',
      link: '/course-filter-one-toggle'
    }
  ];

  return (
    <div className="rbt-categories-area bg-color-white rbt-section-gapBottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <span className="subtitle bg-primary-opacity">CATEGORIES</span>
              <h2 className="title">Explore Top Courses Categories <br /> That Change Yourself</h2>
            </div>
          </div>
        </div>
        <div className="row g-5 mt--20">
          {categories.map((category) => (
            <div key={category.id} className="col-lg-3 col-md-6 col-sm-6 col-12">
              <a className="rbt-cat-box rbt-cat-box-1 text-center" href={category.link}>
                <div className="inner">
                  <div className="icons">
                    <img src={category.icon} alt="Icons Images" />
                  </div>
                  <div className="content">
                    <h5 className="title">{category.title}</h5>
                    <div className="read-more-btn">
                      <span className="rbt-btn-link">{category.courses} Courses<i className="feather-arrow-right"></i></span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;