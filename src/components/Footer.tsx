import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialIcons = [
    { name: 'Facebook', icon: 'f', href: '#' },
    { name: 'Twitter', icon: 'X', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'LinkedIn', icon: 'in', href: '#' },
    { name: 'TikTok', icon: '♪', href: '#' }
  ];

  return (
    <footer className="bg-[rgb(25,55,49)] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Website Information */}
          <div>
            {/* Logo */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3">
                <span className="text-[rgb(25,55,49)] font-bold text-xl">U</span>
              </div>
              <span className="text-2xl font-bold">Lernen</span>
            </div>
            
            {/* Description */}
            <p className="text-white/90 mb-8 leading-relaxed">
              Lernen is the top online tutoring platform for children, dedicated to connecting each student with their perfect tutor. With a network of over 1 million qualified tutors, we provide exceptional tutoring in every school subject.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white/90">(316) 555-0116</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white/90">hello@gmail.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/90">4517 Washington Ave. Manchester, Kentucky 39495</span>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-8">
              {socialIcons.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="w-10 h-10 bg-[rgb(25,55,49)] border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <span className="text-white text-sm font-medium">{social.icon}</span>
                </a>
              ))}
            </div>
            
            {/* CTA Button */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Join us for free
            </button>
          </div>
          
          {/* Right Column - Navigation Links */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* First Row */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">Our company</h3>
                <ul className="space-y-3">
                  {['About', 'Terms and Condition', 'Find tutor', 'Common FAQs', 'How it Works', 'Blogs'].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/80 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">Tutors near you</h3>
                <ul className="space-y-3">
                  {['Tutors in Afghanistan', 'Tutors in Albania', 'Tutors in Algeria', 'Tutors in American Samoa', 'Tutors in Andorra', 'Tutors in Angola'].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/80 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Second Row */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">One-on-One sessions</h3>
                <ul className="space-y-3">
                  {['Online English classes', 'Online Maths classes', 'Online Physics classes', 'Online Chemistry classes', 'Online Science classes', 'Online Computer classes'].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/80 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white">Group sessions</h3>
                <ul className="space-y-3">
                  {['Online English classes', 'Online Maths classes', 'Online Physics classes', 'Online Chemistry classes', 'Online Science classes', 'Online Computer classes'].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/80 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Mobile Apps Section */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-4 text-white">Get mobile apps</h3>
              <p className="text-white/90 mb-6">
                Take education on the go. Get our mobile app for FREE! on your Apple and Android devices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-block">
                  <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-xs">
                      <div>Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </div>
                </a>
                <a href="#" className="inline-block">
                  <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.864 12l5.834-3.291zM5.864 12L.03 15.291l2.808 1.626 10.937-6.333L5.864 12z"/>
                    </svg>
                    <div className="text-xs">
                      <div>Download on the</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar - Copyright */}
      <div className="bg-[rgb(20,45,40)] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">Copyright © 2025, All Right Reserved.</p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms and Conditions</Link>
              <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;