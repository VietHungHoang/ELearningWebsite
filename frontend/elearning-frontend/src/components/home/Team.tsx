import React from 'react';

const Team: React.FC = () => {
  const teachers = [
    {
      id: 1,
      name: 'Mames Mary',
      designation: 'English Teacher',
      location: 'CO Miego, AD,USA',
      description: 'Histudy The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-01.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    },
    {
      id: 2,
      name: 'Robert Song',
      designation: 'Math Teacher',
      location: 'CO Miego, AD,USA',
      description: 'Education The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-02.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    },
    {
      id: 3,
      name: 'William Susan',
      designation: 'React Teacher',
      location: 'CO Miego, AD,USA',
      description: 'React The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-03.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    },
    {
      id: 4,
      name: 'Soseph Sara',
      designation: 'Web Teacher',
      location: 'CO Miego, AD,USA',
      description: 'Histudy The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-04.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    },
    {
      id: 5,
      name: 'Thomas Dal',
      designation: 'Graphic Teacher',
      location: 'CO Miego, AD,USA',
      description: 'Histudy The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-05.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    },
    {
      id: 6,
      name: 'Christopher Lisa',
      designation: 'English Teacher',
      location: 'CO Miego, AD,USA',
      description: 'Histudy The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      image: '/assets/images/team/team-06.jpg',
      phone: '+1-202-555-0174',
      email: 'example@gmail.com',
      social: {
        facebook: 'https://www.facebook.com/',
        twitter: 'https://www.twitter.com',
        instagram: 'https://www.instagram.com/'
      }
    }
  ];

  return (
    <div className="rbt-team-area rbt-section-gap bg-color-extra2">
      <div className="container">
        <div className="row mb--60">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <span className="subtitle bg-primary-opacity">Our Teacher</span>
              <h2 className="title">Whose Inspirations You</h2>
            </div>
          </div>
        </div>
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="rbt-team-tab-content tab-content" id="myTabContent">
              {teachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  className={`tab-pane fade ${index === 0 ? 'active show' : ''}`}
                  id={`team-tab${teacher.id}`}
                  role="tabpanel"
                  aria-labelledby={`team-tab${teacher.id}-tab`}
                >
                  <div className="inner">
                    <div className="rbt-team-thumbnail">
                      <div className="thumb">
                        <img src={teacher.image} alt="Testimonial Images" />
                      </div>
                    </div>
                    <div className="rbt-team-details">
                      <div className="author-info">
                        <h4 className="title">{teacher.name}</h4>
                        <span className="designation theme-gradient">{teacher.designation}</span>
                        <span className="team-form">
                          <i className="feather-map-pin"></i>
                          <span className="location">{teacher.location}</span>
                        </span>
                      </div>
                      <p>{teacher.description}</p>
                      <ul className="social-icon social-default mt--20 justify-content-start">
                        <li>
                          <a href={teacher.social.facebook}>
                            <i className="feather-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <a href={teacher.social.twitter}>
                            <i className="feather-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href={teacher.social.instagram}>
                            <i className="feather-instagram"></i>
                          </a>
                        </li>
                      </ul>
                      <ul className="rbt-information-list mt--25">
                        <li>
                          <a href={`tel:${teacher.phone}`}>
                            <i className="feather-phone"></i>{teacher.phone}
                          </a>
                        </li>
                        <li>
                          <a href={`mailto:${teacher.email}`}>
                            <i className="feather-mail"></i>{teacher.email}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              <div className="top-circle-shape"></div>
            </div>
          </div>

          <div className="col-lg-5">
            <ul className="rbt-team-tab-thumb nav nav-tabs" id="myTab" role="tablist">
              {teachers.map((teacher, index) => (
                <li key={teacher.id}>
                  <a
                    className={index === 0 ? 'active' : ''}
                    id={`team-tab${teacher.id}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={`#team-tab${teacher.id}`}
                    role="tab"
                    aria-controls={`team-tab${teacher.id}`}
                    aria-selected={index === 0 ? 'true' : 'false'}
                  >
                    <div className="rbt-team-thumbnail">
                      <div className="thumb">
                        <img src={teacher.image} alt="Testimonial Images" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;