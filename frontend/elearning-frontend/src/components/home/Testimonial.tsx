import React from 'react';

const Testimonial: React.FC = () => {
  const testimonials = [
    {
      icon: 'facebook',
      text: 'After the launch, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Martha Maldonado',
      position: 'CEO',
      image: 'client-01.png'
    },
    {
      icon: 'google',
      text: 'Histudy education, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Michael D.',
      position: 'CEO',
      image: 'client-02.png'
    },
    {
      icon: 'yelp',
      text: 'Our educational, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Valerie J.',
      position: 'CEO',
      image: 'client-03.png'
    },
    {
      icon: 'facebook',
      text: 'People says about, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Hannah R.',
      position: 'CEO',
      image: 'client-04.png'
    },
    {
      icon: 'bing',
      text: 'Like this histudy, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Pearl B. Hill',
      position: 'Marketing',
      image: 'client-05.png'
    },
    {
      icon: 'facebook',
      text: 'Educational template, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Mandy F. Wood',
      position: 'SR Designer',
      image: 'client-01.png'
    },
    {
      icon: 'hubs',
      text: 'Online leaning, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Mildred W. Diaz',
      position: 'Executive',
      image: 'client-07.png'
    },
    {
      icon: 'bing',
      text: 'Remote learning, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Christopher',
      position: 'CEO',
      image: 'client-08.png'
    },
    {
      icon: 'yelp',
      text: 'University managemnet, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi. Vestibulum eget risus velit.',
      name: 'Fatima',
      position: 'Child',
      image: 'client-06.png'
    }
  ];

  return (
    <div className="rbt-testimonial-area bg-color-white rbt-section-gap overflow-hidden">
      <div className="wrapper">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb--10">
                <span className="subtitle bg-primary-opacity">EDUCATION FOR EVERYONE</span>
                <h2 className="title">People like histudy education. <br /> No joking - here's the proof!</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-animation-wrapper no-overlay mt--50">
        <div className="scroll-animation scroll-right-left">
          {testimonials.slice(0, 9).map((testimonial, index) => (
            <div key={index} className="single-column-20 bg-theme-gradient-odd">
              <div className="rbt-testimonial-box style-2">
                <div className="inner">
                  <div className="icons">
                    <img src={`/assets/images/icons/${testimonial.icon}.png`} alt="Clint Images" />
                  </div>
                  <div className="description">
                    <p className="subtitle-3">{testimonial.text}</p>
                    <div className="clint-info-wrapper">
                      <div className="thumb">
                        <img src={`/assets/images/testimonial/${testimonial.image}`} alt="Clint Images" />
                      </div>
                      <div className="client-info">
                        <h5 className="title">{testimonial.name}, <span>{testimonial.position}</span></h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-animation-wrapper no-overlay mt--30">
        <div className="scroll-animation scroll-left-right">
          {testimonials.slice(0, 9).map((testimonial, index) => (
            <div key={index} className="single-column-20 bg-theme-gradient-even">
              <div className="rbt-testimonial-box style-2">
                <div className="inner">
                  <div className="icons">
                    <img src={`/assets/images/icons/${testimonial.icon}.png`} alt="Clint Images" />
                  </div>
                  <div className="description">
                    <p className="subtitle-3">{testimonial.text}</p>
                    <div className="clint-info-wrapper">
                      <div className="thumb">
                        <img src={`/assets/images/testimonial/${testimonial.image}`} alt="Clint Images" />
                      </div>
                      <div className="client-info">
                        <h5 className="title">{testimonial.name}, <span>{testimonial.position}</span></h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;