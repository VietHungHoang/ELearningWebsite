import React from 'react';

const Newsletter: React.FC = () => {
  const counters = [
    {
      id: 1,
      count: 500,
      title: 'Successfully Trained',
      subtitle: 'Learners & counting'
    },
    {
      id: 2,
      count: 100,
      title: 'Certification Students',
      subtitle: 'Online Course'
    }
  ];

  return (
    <div className="rbt-newsletter-area newsletter-style-2 bg-color-primary rbt-section-gap">
      <div className="container">
        <div className="row row--15 align-items-center">
          <div className="col-lg-12">
            <div className="inner text-center">
              <div className="section-title text-center">
                <span className="subtitle bg-white-opacity">Get Latest Histudy Update</span>
                <h2 className="title color-white">
                  <strong>Subscribe</strong> Our Newsletter
                </h2>
                <p className="description color-white mt--20">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam explicabo sit est eos earum reprehenderit inventore nam autem corrupti rerum!
                </p>
              </div>
              <form action="#" className="newsletter-form-1 mt--40">
                <input type="email" placeholder="Enter Your E-Email" />
                <button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse">
                  <span className="icon-reverse-wrapper">
                    <span className="btn-text">Subscribe</span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                  </span>
                </button>
              </form>
              <span className="note-text color-white mt--20">No ads, No trails, No commitments</span>

              <div className="row row--15 mt--50">
                {counters.map((counter, index) => (
                  <div
                    key={counter.id}
                    className={`col-lg-3 ${index === 0 ? 'offset-lg-3' : ''} col-md-6 col-sm-6 single-counter ${index > 0 ? 'mt_mobile--30' : ''}`}
                  >
                    <div className="rbt-counterup rbt-hover-03 style-2 text-color-white">
                      <div className="inner">
                        <div className="content">
                          <h3 className="counter color-white">
                            <span className="odometer" data-count={counter.count}>00</span>
                          </h3>
                          <h5 className="title color-white">{counter.title}</h5>
                          <span className="subtitle color-white">{counter.subtitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;