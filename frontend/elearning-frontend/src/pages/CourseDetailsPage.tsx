import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseSidebarDetails from '../components/courses/CourseSidebarDetails';
import CourseActionBottom from '../components/courses/CourseActionBottom';
import RelatedCourses from '../components/courses/RelatedCourses';
import CourseBreadcrumb from '../components/courses/CourseBreadcrumb';
import CourseOverview from '../components/courses/CourseOverview';
import CourseContent from '../components/courses/CourseContent';
import CourseDetails from '../components/courses/CourseDetails';
import Instructor from '../components/courses/Instructor';
import Review from '../components/courses/Review';

const CourseDetailsPage: React.FC = () => {
  return (
    <>
      <Header />
      <CourseBreadcrumb />
      <div className="rbt-course-details-area ptb--60">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="course-details-content">
                <div className="rbt-course-feature-box rbt-shadow-box thuumbnail">
                  <img className="w-100" src="/assets/images/course/course-01.jpg" alt="Course thumbnail" />
                </div>

                <div className="rbt-inner-onepage-navigation sticky-top mt--30">
                  <nav className="mainmenu-nav onepagenav">
                    <ul className="mainmenu">
                      <li className="current">
                        <a href="#overview">Overview</a>
                      </li>
                      <li>
                        <a href="#coursecontent">Course Content</a>
                      </li>
                      <li>
                        <a href="#details">Details</a>
                      </li>
                      <li>
                        <a href="#intructor">Intructor</a>
                      </li>
                      <li>
                        <a href="#review">Review</a>
                      </li>
                    </ul>
                  </nav>
                </div>

                <CourseOverview />
                <CourseContent />
                <CourseDetails />
                <Instructor />
                <Review />
              </div>
            </div>

            <div className="col-lg-4">
              <CourseSidebarDetails />
            </div>
          </div>
        </div>
      </div>

      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      <RelatedCourses />
      <CourseActionBottom />
      <Footer />
    </>
  );
};

export default CourseDetailsPage;