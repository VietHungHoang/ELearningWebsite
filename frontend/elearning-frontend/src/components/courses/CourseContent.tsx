import React from 'react';

const CourseContent: React.FC = () => {
  return (
    <div className="course-content rbt-shadow-box coursecontent-wrapper mt--30" id="coursecontent">
      <div className="rbt-course-feature-inner">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Course Content</h4>
        </div>
        <div className="rbt-accordion-style rbt-accordion-02 accordion" id="accordionExampleb2">
          <div className="accordion" id="accordionExampleb2">

            <div className="accordion-item card">
              <h2 className="accordion-header card-header" id="headingTwo1">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo1" aria-expanded="true" aria-controls="collapseTwo1">
                  Intro to Course and Histudy <span className="rbt-badge-5 ml--10">1hr 30min</span>
                </button>
              </h2>
              <div id="collapseTwo1" className="accordion-collapse collapse show" aria-labelledby="headingTwo1" data-bs-parent="#accordionExampleb2">
                <div className="accordion-body card-body pr--0">
                  <ul className="rbt-course-main-content liststyle">
                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-play-circle"></i> <span className="text">Course Intro</span>
                        </div>
                        <div className="course-content-right">
                          <span className="min-lable">30 min</span>
                          <span className="rbt-badge variation-03 bg-primary-opacity"><i className="feather-eye"></i> Preview</span>
                        </div>
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-play-circle"></i> <span className="text">Watch Before Start</span>
                        </div>
                        <div className="course-content-right">
                          <span className="min-lable">0.5 min</span>
                          <span className="rbt-badge variation-03 bg-primary-opacity"><i className="feather-eye"></i> Preview</span>
                        </div>
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-file-text"></i> <span className="text">Read Before You Start</span>
                        </div>
                        <div className="course-content-right">
                          <span className="course-lock"><i className="feather-lock"></i></span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item card">
              <h2 className="accordion-header card-header" id="headingTwo2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo2" aria-expanded="false" aria-controls="collapseTwo2">
                  Course Fundamentals <span className="rbt-badge-5 ml--10">2hr 30min</span>
                </button>
              </h2>
              <div id="collapseTwo2" className="accordion-collapse collapse" aria-labelledby="headingTwo2" data-bs-parent="#accordionExampleb2">
                <div className="accordion-body card-body pr--0">
                  <ul className="rbt-course-main-content liststyle">
                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-play-circle"></i> <span className="text">Course Intro</span>
                        </div>
                        <div className="course-content-right">
                          <span className="course-lock"><i className="feather-lock"></i></span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-file-text"></i> <span className="text">Read Before You Start</span>
                        </div>
                        <div className="course-content-right">
                          <span className="course-lock"><i className="feather-lock"></i></span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item card">
              <h2 className="accordion-header card-header" id="headingTwo3">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo3" aria-expanded="false" aria-controls="collapseTwo3">
                  You can develop skill and setup <span className="rbt-badge-5 ml--10">1hr 50min</span>
                </button>
              </h2>
              <div id="collapseTwo3" className="accordion-collapse collapse" aria-labelledby="headingTwo3" data-bs-parent="#accordionExampleb2">
                <div className="accordion-body card-body pr--0">
                  <ul className="rbt-course-main-content liststyle">
                    <li>
                      <a href="#">
                        <div className="course-content-left">
                          <i className="feather-play-circle"></i> <span className="text">Course Intro</span>
                        </div>
                        <div className="course-content-right">
                          <span className="course-lock"><i className="feather-lock"></i></span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;