import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentDashboardHeader from '../components/dashboard/StudentDashboardHeader';
import StudentDashboardSidebar from '../components/dashboard/StudentDashboardSidebar';

const StudentReviewsPage: React.FC = () => {
  const reviews = [
    {
      id: 1,
      course: "Speaking Korean for Beginners",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 2,
      course: "Introduction to Calculus",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 3,
      course: "How to Write Your First Novel",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 4,
      course: "Speaking Korean for Beginners",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 5,
      course: "How to Write Your First Novel",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 6,
      course: "Speaking Korean for Beginners",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    },
    {
      id: 7,
      course: "Speaking Korean for Beginners",
      rating: 5,
      reviewCount: 9,
      feedback: "Good"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`fas fa-star ${index < rating ? '' : 'text-muted'}`}></i>
    ));
  };

  return (
    <>
      <Header />
      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <StudentDashboardHeader />

              <div className="row g-5">
                <div className="col-lg-3">
                  <StudentDashboardSidebar activeLink="reviews" />
                </div>

                <div className="col-lg-9">
                  <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                    <div className="content">
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">Reviews</h4>
                      </div>

                      <div className="rbt-dashboard-table table-responsive mobile-table-750">
                        <table className="rbt-table table table-borderless">
                          <thead>
                            <tr>
                              <th>Course</th>
                              <th>Feedback</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.map((review) => (
                              <tr key={review.id}>
                                <th>
                                  <span className="b3"><a href="#">{review.course}</a></span>
                                </th>
                                <td>
                                  <div className="rbt-review">
                                    <div className="rating">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="rating-count"> ({review.reviewCount} Reviews)</span>
                                  </div>
                                  <p className="b2">{review.feedback}</p>
                                </td>
                                <td>
                                  <div className="rbt-button-group justify-content-end">
                                    <a className="rbt-btn btn-xs bg-primary-opacity radius-round" href="#" title="Edit">
                                      <i className="feather-edit pl--0"></i>
                                    </a>
                                    <a className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger" href="#" title="Delete">
                                      <i className="feather-trash-2 pl--0"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentReviewsPage;