import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    // Initialize odometer counter - Simplified version
    const handleScroll = () => {
      const counters = document.querySelectorAll('.odometer');
      counters.forEach((counter) => {
        const el = counter as HTMLElement;
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !el.hasAttribute('data-animated')) {
          const target = parseInt(el.getAttribute('data-count') || '0');
          let current = 0;
          const increment = target / 50; // Faster animation

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toString();
          }, 30);

          el.setAttribute('data-animated', 'true');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Start About Area */}
      <div className="rbt-about-area bg-color-white rbt-section-gapTop pb_md--80 pb_sm--80 about-style-1">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="thumbnail-wrapper">
                <div className="thumbnail image-1">
                  <img
                    src="/assets/images/about/about-01.png"
                    alt="Education Images"
                  />
                </div>
                <div className="thumbnail image-2 d-none d-xl-block">
                  <img
                    src="/assets/images/about/about-02.png"
                    alt="Education Images"
                  />
                </div>
                <div className="thumbnail image-3 d-none d-md-block">
                  <img
                    src="/assets/images/about/about-03.png"
                    alt="Education Images"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="inner pl--50 pl_sm--0 pl_md--0">
                <div className="section-title text-start">
                  <span className="subtitle bg-coral-opacity">Know About Us</span>
                  <h2 className="title">Know About Histudy <br /> Learning Platform</h2>
                </div>

                <p className="description mt--30">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>

                {/* Start Feature List */}
                <div className="rbt-feature-wrapper mt--20 ml_dec_20">
                  <div className="rbt-feature feature-style-2 rbt-radius">
                    <div className="icon bg-pink-opacity">
                      <i className="feather-heart"></i>
                    </div>
                    <div className="feature-content">
                      <h6 className="feature-title">Flexible Classes</h6>
                      <p className="feature-description">It is a long established fact that a reader will be distracted by this on readable content of when looking at its layout.</p>
                    </div>
                  </div>

                  <div className="rbt-feature feature-style-2 rbt-radius">
                    <div className="icon bg-primary-opacity">
                      <i className="feather-book"></i>
                    </div>
                    <div className="feature-content">
                      <h6 className="feature-title">Learn From Anywhere</h6>
                      <p className="feature-description">Sed distinctio repudiandae eos recusandae laborum eaque non eius iure suscipit laborum eaque non eius iure suscipit.</p>
                    </div>
                  </div>
                </div>
                {/* End Feature List */}

                <div className="about-btn mt--40">
                  <a className="rbt-btn btn-gradient hover-icon-reverse" href="#">
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">More About Us</span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                      <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End About Area */}

      {/* Start Call To Action */}
      <div className="rbt-callto-action-area mt_dec--half">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="rbt-callto-action callto-action-default bg-color-white rbt-radius shadow-1">
                <div className="row align-items-center">
                  <div className="col-lg-12 col-xl-5">
                    <div className="inner">
                      <div className="rbt-category mb--20">
                        <a href="#">New Collection</a>
                      </div>
                      <h4 className="title mb--15">Online Courses from Histudy</h4>
                      <p className="mb--15">Top instructors from around the world</p>
                    </div>
                  </div>
                  <div className="col-lg-12 col-xl-7">
                    <div className="video-popup-wrapper mt_lg--10 mt_md--20 mt_sm--20">
                      <img className="w-100 rbt-radius" src="/assets/images/others/video-01.jpg" alt="Video Images" />
                      <a className="rbt-btn rounded-player-2 sm-size popup-video position-to-top with-animation" href="https://www.youtube.com/watch?v=nA1Aqp0sPQo">
                        <span className="play-icon"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rbt-callto-action callto-action-default bg-color-white rbt-radius shadow-1">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="inner">
                      <div className="rbt-category mb--20">
                        <a href="#">Top Teacher</a>
                      </div>
                      <h4 className="title mb--10">Free Online Courses from Histudy School To Education</h4>
                      <p className="mb--15">Top instructors from around the world</p>
                      <div className="read-more-btn">
                        <a className="rbt-btn rbt-switch-btn btn-gradient btn-sm" href="#">
                          <span data-text="Join Now">Join Now</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Call To Action */}

      {/* Start Counterup Area */}
      <div className="rbt-counterup-area bg-color-extra2 rbt-section-gapBottom default-callto-action-overlap">
        <div className="container">
          <div className="row mb--60">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <span className="subtitle bg-primary-opacity">Why Choose Us</span>
                <h2 className="title">Creating A Community Of <br /> Life Long Learners.</h2>
              </div>
            </div>
          </div>
          <div className="row g-5 hanger-line">
            {/* Start Single Counter */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                <div className="top-circle-shape"></div>
                <div className="inner">
                  <div className="rbt-round-icon">
                    <img src="/assets/images/icons/counter-01.png" alt="Icons Images" />
                  </div>
                  <div className="content">
                    <h3 className="counter"><span className="odometer" data-count="500">00</span></h3>
                    <span className="subtitle">Learners &amp; counting</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Single Counter */}

            {/* Start Single Counter */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--60 mt_md--30 mt_sm--30 mt_mobile--60">
              <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                <div className="top-circle-shape"></div>
                <div className="inner">
                  <div className="rbt-round-icon">
                    <img src="/assets/images/icons/counter-02.png" alt="Icons Images" />
                  </div>
                  <div className="content">
                    <h3 className="counter"><span className="odometer" data-count="800">00</span></h3>
                    <span className="subtitle">Courses & Video</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Single Counter */}

            {/* Start Single Counter */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt_md--60 mt_sm--60">
              <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                <div className="top-circle-shape"></div>
                <div className="inner">
                  <div className="rbt-round-icon">
                    <img src="/assets/images/icons/counter-03.png" alt="Icons Images" />
                  </div>
                  <div className="content">
                    <h3 className="counter"><span className="odometer" data-count="1000">00</span></h3>
                    <span className="subtitle">Certified Students</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Single Counter */}

            {/* Start Single Counter */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--60 mt_md--30 mt_sm--30 mt_mobile--60">
              <div className="rbt-counterup rbt-hover-03 border-bottom-gradient">
                <div className="top-circle-shape"></div>
                <div className="inner">
                  <div className="rbt-round-icon">
                    <img src="/assets/images/icons/counter-04.png" alt="Icons Images" />
                  </div>
                  <div className="content">
                    <h3 className="counter"><span className="odometer" data-count="100">00</span></h3>
                    <span className="subtitle">Registered Enrolls</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Single Counter */}
          </div>
        </div>
      </div>
      {/* End Counterup Area */}
    </>
  );
};

export default About;