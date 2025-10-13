import React from 'react';

const CourseDetails: React.FC = () => {
  return (
    <div className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30" id="details">
      <div className="row g-5">
        <div className="col-lg-6">
          <div className="section-title">
            <h4 className="rbt-title-style-3 mb--20">Requirements</h4>
          </div>
          <ul className="rbt-list-style-1">
            <li><i className="feather-check"></i>Become an advanced, confident, and modern JavaScript developer from scratch.</li>
            <li><i className="feather-check"></i>Have an intermediate skill level of Python programming.</li>
            <li><i className="feather-check"></i>Have a portfolio of various data analysis projects.</li>
            <li><i className="feather-check"></i>Use the numpy library to create and manipulate arrays.</li>
          </ul>
        </div>

        <div className="col-lg-6">
          <div className="section-title">
            <h4 className="rbt-title-style-3 mb--20">Description</h4>
          </div>
          <ul className="rbt-list-style-1">
            <li><i className="feather-check"></i>Use the Jupyter Notebook Environment. JavaScript developer from scratch.</li>
            <li><i className="feather-check"></i>Use the pandas module with Python to create and structure data.</li>
            <li><i className="feather-check"></i>Have a portfolio of various data analysis projects.</li>
            <li><i className="feather-check"></i>Create data visualizations using matplotlib and the seaborn.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;