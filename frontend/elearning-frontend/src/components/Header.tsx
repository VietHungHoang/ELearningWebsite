import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.classList.contains('rbt-header-sticky')) {
        const headerWrapper = headerWrapperRef.current;
        const stickyPlaceholder = placeholderRef.current;
        if (headerWrapper && stickyPlaceholder) {
          const headerContainerH = headerWrapper.offsetHeight;
          const topHeaderH = 0; // Assuming no top header, adjust if needed
          const targetScroll = topHeaderH + 200;
          if (window.scrollY > targetScroll) {
            headerWrapper.classList.add('rbt-sticky');
            stickyPlaceholder.style.height = `${headerContainerH}px`;
          } else {
            headerWrapper.classList.remove('rbt-sticky');
            stickyPlaceholder.style.height = '0px';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={placeholderRef} className="rbt-sticky-placeholder"></div>
      <header className="rbt-header rbt-header-10">
      {/* Start Header Top */}
      <div className="rbt-header-top rbt-header-top-1 header-space-betwween bg-not-transparent bg-color-darker top-expended-activation">
        <div className="container-fluid">
          <div className="top-expended-wrapper">
            <div className="top-expended-inner rbt-header-sec align-items-center">
              <div className="rbt-header-sec-col rbt-header-left d-none d-xl-block">
                <div className="rbt-header-content">
                  {/* Start Header Information List */}
                  <div className="header-info">
                    <ul className="rbt-information-list">
                      <li>
                        <a href="#"><i className="fab fa-instagram"></i>100k <span className="d-none d-xxl-block">Followers</span></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-facebook-square"></i>500k <span className="d-none d-xxl-block">Followers</span></a>
                      </li>
                      <li>
                        <a href="#"><i className="feather-phone"></i>+1-202-555-0174</a>
                      </li>
                    </ul>
                  </div>
                  {/* End Header Information List */}
                </div>
              </div>
              <div className="rbt-header-sec-col rbt-header-center">
                <div className="rbt-header-content justify-content-start justify-content-xl-center">
                  <div className="header-info">
                    <div className="rbt-header-top-news">
                      <div className="inner">
                        <div className="content">
                          <span className="rbt-badge variation-02 bg-color-primary color-white radius-round">Hot</span>
                          <span className="news-text"><img src="/assets/images/icons/hand-emojji.svg" alt="Hand Emojji Images" /> Intro price. Get Histudy for Big Sale -95% off.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rbt-header-sec-col rbt-header-right mt_md--10 mt_sm--10">
                <div className="rbt-header-content justify-content-start justify-content-lg-end">
                  <div className="header-info d-none d-xl-block">
                    <ul className="social-share-transparent">
                      <li>
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                      </li>
                    </ul>
                  </div>

                  <div className="rbt-separator d-none d-xl-block"></div>

                  <div className="header-info">
                    <ul className="rbt-dropdown-menu switcher-language">
                      <li className="has-child-menu">
                        <a href="#">
                          <img className="left-image" src="/assets/images/icons/en-us.png" alt="Language Images" />
                          <span className="menu-item">English</span>
                          <i className="right-icon feather-chevron-down"></i>
                        </a>
                        <ul className="sub-menu">
                          <li>
                            <a href="#">
                              <img className="left-image" src="/assets/images/icons/fr.png" alt="Language Images" />
                              <span className="menu-item">Français</span>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <img className="left-image" src="/assets/images/icons/de.png" alt="Language Images" />
                              <span className="menu-item">Deutsch</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="header-info">
                    <ul className="rbt-dropdown-menu currency-menu">
                      <li className="has-child-menu">
                        <a href="#">
                          <span className="menu-item">USD</span>
                          <i className="right-icon feather-chevron-down"></i>
                        </a>
                        <ul className="sub-menu hover-reverse">
                          <li>
                            <a href="#">
                              <span className="menu-item">EUR</span>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <span className="menu-item">GBP</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-info">
              <div className="top-bar-expended d-block d-lg-none">
                <button className="topbar-expend-button rbt-round-btn"><i className="feather-plus"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Top */}

      {/* Start Main Header */}
      <div ref={headerWrapperRef} className="rbt-header-wrapper header-space-betwween header-sticky">
        <div className="container-fluid">
          <div className="mainbar-row rbt-navigation-center align-items-center">
            {/* Header Left */}
            <div className="header-left rbt-header-content">
              <div className="header-info">
                <div className="logo">
                  <a href="/">
                    <img src="/assets/images/logo/logo.png" alt="Education Logo Images" />
                  </a>
                </div>
              </div>
              <div className="header-info">
                <div className="rbt-category-menu-wrapper">
                  <div className="rbt-category-btn rbt-side-offcanvas-activation">
                    <div className="rbt-offcanvas-trigger md-size icon">
                      <span className="d-none d-xl-block">
                        <i className="feather-grid"></i>
                      </span>
                      <i className="feather-grid d-block d-xl-none" title="Category"></i>
                    </div>
                    <span className="category-text d-none d-xl-block">Category</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="rbt-main-navigation d-none d-xl-block">
              <nav className="mainmenu-nav">
                <ul className="mainmenu">
                  <li className="with-megamenu has-menu-child-item position-static">
                    <a href="#">Home <i className="feather-chevron-down"></i></a>
                  </li>
                  <li>
                    <Link to="/courses">Courses</Link>
                  </li>
                  <li className="has-dropdown has-menu-child-item">
                    <a href="#">Dashboard <i className="feather-chevron-down"></i></a>
                  </li>
                  <li className="with-megamenu has-menu-child-item position-static">
                    <a href="#">Pages <i className="feather-chevron-down"></i></a>
                  </li>
                  <li className="with-megamenu has-menu-child-item position-static">
                    <a href="#">Elements <i className="feather-chevron-down"></i></a>
                  </li>
                  <li className="with-megamenu has-menu-child-item position-static">
                    <a href="#">Blog <i className="feather-chevron-down"></i></a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Header Right */}
            <div className="header-right">
              {/* Navbar Icons */}
              <ul className="quick-access">
                <li className="access-icon">
                  <a className="search-trigger-active rbt-round-btn" href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(!isSearchOpen); }}>
                    <i className="feather-search"></i>
                  </a>
                </li>
                <li className="access-icon rbt-mini-cart">
                  <a className="rbt-cart-sidenav-activation rbt-round-btn" href="#">
                    <i className="feather-shopping-cart"></i>
                    <span className="rbt-cart-count">4</span>
                  </a>
                </li>
                <li className="account-access rbt-user-wrapper d-none d-xl-block">
                  <a href="#"><i className="feather-user"></i>Admin</a>
                  <div className="rbt-user-menu-list-wrapper">
                    <div className="inner">
                      <div className="rbt-admin-profile">
                        <div className="admin-thumbnail">
                          <img src="/assets/images/team/avatar.jpg" alt="User Images" />
                        </div>
                        <div className="admin-info">
                          <span className="name">Nipa Bali</span>
                          <a className="rbt-btn-link color-primary" href="/profile">View Profile</a>
                        </div>
                      </div>
                      <ul className="user-list-wrapper">
                        <li>
                          <a href="/dashboard">
                            <i className="feather-home"></i>
                            <span>My Dashboard</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="feather-bookmark"></i>
                            <span>Bookmark</span>
                          </a>
                        </li>
                        <li>
                          <a href="/enrolled-courses">
                            <i className="feather-shopping-bag"></i>
                            <span>Enrolled Courses</span>
                          </a>
                        </li>
                        <li>
                          <a href="/wishlist">
                            <i className="feather-heart"></i>
                            <span>Wishlist</span>
                          </a>
                        </li>
                        <li>
                          <a href="/reviews">
                            <i className="feather-star"></i>
                            <span>Reviews</span>
                          </a>
                        </li>
                        <li>
                          <a href="/quiz-attempts">
                            <i className="feather-list"></i>
                            <span>My Quiz Attempts</span>
                          </a>
                        </li>
                        <li>
                          <a href="/order-history">
                            <i className="feather-clock"></i>
                            <span>Order History</span>
                          </a>
                        </li>
                        <li>
                          <a href="/qa">
                            <i className="feather-message-square"></i>
                            <span>Question & Answer</span>
                          </a>
                        </li>
                      </ul>
                      <hr className="mt--10 mb--10" />
                      <ul className="user-list-wrapper">
                        <li>
                          <a href="#">
                            <i className="feather-book-open"></i>
                            <span>Getting Started</span>
                          </a>
                        </li>
                      </ul>
                      <hr className="mt--10 mb--10" />
                      <ul className="user-list-wrapper">
                        <li>
                          <a href="/settings">
                            <i className="feather-settings"></i>
                            <span>Settings</span>
                          </a>
                        </li>
                        <li>
                          <a href="/">
                            <i className="feather-log-out"></i>
                            <span>Logout</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="access-icon rbt-user-wrapper d-block d-xl-none">
                  <a className="rbt-round-btn" href="#"><i className="feather-user"></i></a>
                </li>
              </ul>

              <div className="rbt-btn-wrapper d-none d-xl-block">
                <a className="rbt-btn rbt-marquee-btn marquee-auto btn-border-gradient radius-round btn-sm hover-transform-none" href="#">
                  <span data-text="Enroll Now">Enroll Now</span>
                </a>
              </div>

              {/* Start Mobile-Menu-Bar */}
              <div className="mobile-menu-bar d-block d-xl-none">
                <div className="hamberger">
                  <button className="hamberger-button rbt-round-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className="feather-menu"></i>
                  </button>
                </div>
              </div>
              {/* End Mobile-Menu-Bar */}
            </div>
          </div>
        </div>
      </div>
      {/* End Main Header */}

      {/* Start Search Dropdown */}
      {isSearchOpen && (
        <div className="rbt-search-dropdown">
          <div className="wrapper">
            <div className="row">
              <div className="col-lg-12">
                <form action="#">
                  <input type="text" placeholder="What are you looking for?" />
                  <div className="submit-btn">
                    <a className="rbt-btn btn-gradient btn-md" href="#">Search</a>
                  </div>
                </form>
              </div>
            </div>

            <div className="rbt-separator-mid">
              <hr className="rbt-separator m-0" />
            </div>

            <div className="row g-4 pt--30 pb--60">
              <div className="col-lg-12">
                <div className="section-title">
                  <h5 className="rbt-title-style-2">Our Top Course</h5>
                </div>
              </div>

              {/* Sample Course Cards */}
              <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                <div className="rbt-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <a href="/course-details">
                      <img src="/assets/images/course/course-online-01.jpg" alt="Card image" />
                    </a>
                  </div>
                  <div className="rbt-card-body">
                    <h5 className="rbt-card-title"><a href="/course-details">React Js</a></h5>
                    <div className="rbt-review">
                      <div className="rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span className="rating-count"> (15 Reviews)</span>
                    </div>
                    <div className="rbt-card-bottom">
                      <div className="rbt-price">
                        <span className="current-price">$15</span>
                        <span className="off-price">$25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Search Dropdown */}

      {/* Start Side Vav */}
      <div className="rbt-offcanvas-side-menu rbt-category-sidemenu">
        <div className="inner-wrapper">
          <div className="inner-top">
            <div className="inner-title">
              <h4 className="title">Course Category</h4>
            </div>
            <div className="rbt-btn-close">
              <button className="rbt-close-offcanvas rbt-round-btn"><i className="feather-x"></i></button>
            </div>
          </div>
          <nav className="side-nav w-100">
            <ul className="rbt-vertical-nav-list-wrapper vertical-nav-menu">
              <li className="vertical-nav-item">
                <a href="#">Course School</a>
              </li>
              <li className="vertical-nav-item">
                <a href="#">Online School</a>
              </li>
              <li className="vertical-nav-item">
                <a href="#">kindergarten</a>
              </li>
              <li className="vertical-nav-item">
                <a href="#">Classic LMS</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* End Side Vav */}

      <a className="rbt-close_side_menu" href="javascript:void(0);"></a>

      {/* Mobile Menu Section */}
      {isMobileMenuOpen && (
        <div className="popup-mobile-menu">
          <div className="inner-wrapper">
            <div className="inner-top">
              <div className="content">
                <div className="logo">
                  <a href="/">
                    <img src="/assets/images/logo/logo.png" alt="Education Logo Images" />
                  </a>
                </div>
                <div className="rbt-btn-close">
                  <button className="close-button rbt-round-btn" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="feather-x"></i>
                  </button>
                </div>
              </div>
              <p className="description">Histudy is a education website template. You can customize all.</p>
              <ul className="navbar-top-left rbt-information-list justify-content-start">
                <li>
                  <a href="mailto:hello@example.com"><i className="feather-mail"></i>example@gmail.com</a>
                </li>
                <li>
                  <a href="#"><i className="feather-phone"></i>(302) 555-0107</a>
                </li>
              </ul>
            </div>

            <nav className="mainmenu-nav">
              <ul className="mainmenu">
                <li className="with-megamenu has-menu-child-item position-static">
                  <a href="#">Home <i className="feather-chevron-down"></i></a>
                </li>
                <li>
                  <Link to="/courses">Courses</Link>
                </li>
                <li className="has-dropdown has-menu-child-item">
                  <a href="#">Dashboard <i className="feather-chevron-down"></i></a>
                </li>
                <li className="with-megamenu has-menu-child-item position-static">
                  <a href="#">Pages <i className="feather-chevron-down"></i></a>
                </li>
                <li className="with-megamenu has-menu-child-item position-static">
                  <a href="#">Elements <i className="feather-chevron-down"></i></a>
                </li>
                <li className="with-megamenu has-menu-child-item position-static">
                  <a href="#">Blog <i className="feather-chevron-down"></i></a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;