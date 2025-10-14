import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../scss/pages/_lesson-page.scss';

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface CourseSection {
  id: number;
  title: string;
  completedLessons: number;
  totalLessons: number;
  lessons: Lesson[];
  isExpanded: boolean;
}

const LessonPage: React.FC = () => {
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: 1,
      title: 'Welcome to Histudy',
      completedLessons: 2,
      totalLessons: 2,
      isExpanded: true,
      lessons: [
        {
          id: 1,
          title: 'Course Introduction',
          type: 'video',
          duration: '30 min',
          isCompleted: true,
          isCurrent: false,
        },
        {
          id: 2,
          title: 'Introduction',
          type: 'text',
          duration: '',
          isCompleted: true,
          isCurrent: false,
        },
      ],
    },
    {
      id: 2,
      title: 'Welcome Lessons',
      completedLessons: 1,
      totalLessons: 3,
      isExpanded: true,
      lessons: [
        {
          id: 3,
          title: 'Hello World!',
          type: 'video',
          duration: '0.37 min',
          isCompleted: true,
          isCurrent: true,
        },
        {
          id: 4,
          title: 'Values and Variables',
          type: 'video',
          duration: '20 min',
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 5,
          title: 'Basic Operators',
          type: 'video',
          duration: '15 min',
          isCompleted: false,
          isCurrent: false,
        },
      ],
    },
    {
      id: 3,
      title: 'Histudy Quiz',
      completedLessons: 0,
      totalLessons: 2,
      isExpanded: false,
      lessons: [
        {
          id: 6,
          title: 'Histudy Quiz Start',
          type: 'quiz',
          duration: '',
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 7,
          title: 'Histudy Quiz Result',
          type: 'quiz',
          duration: '',
          isCompleted: false,
          isCurrent: false,
        },
      ],
    },
    {
      id: 4,
      title: 'Histudy Assignments',
      completedLessons: 0,
      totalLessons: 2,
      isExpanded: false,
      lessons: [
        {
          id: 8,
          title: 'Histudy Assignments',
          type: 'assignment',
          duration: '',
          isCompleted: false,
          isCurrent: false,
        },
        {
          id: 9,
          title: 'Histudy Assignments Submit',
          type: 'assignment',
          duration: '',
          isCompleted: false,
          isCurrent: false,
        },
      ],
    },
  ]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('course-content');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle tab switching when sidebar state changes
  useEffect(() => {
    if (!sidebarCollapsed && activeTab === 'course-content') {
      setActiveTab('overview');
    }
  }, [sidebarCollapsed, activeTab]);

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'feather-play-circle';
      case 'text':
        return 'feather-file-text';
      case 'quiz':
        return 'feather-help-circle';
      case 'assignment':
        return 'feather-file-text';
      default:
        return 'feather-file';
    }
  };

  return (
    <div className="lesson-page-wrapper">
      {/* Lesson Header */}
      <header className="lesson-header">
        <div className="container-fluid">
          <div className="lesson-header-content">
            <div className="lesson-header-left">
              <Link to="/" className="lesson-logo">
                <img src="/assets/images/logo/logo.png" alt="EduLearn" />
              </Link>
              <h5 className="course-title">The Complete Histudy 2023: From Zero to Expert!</h5>
            </div>
            <div className="lesson-header-right">
              <Link to="/course-details" className="close-btn" title="Go Back to Course">
                <i className="feather-x"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="lesson-main-content">
        {/* Main Content */}
        <main className="lesson-content">
          <div className="lesson-video-wrapper">
            <div className="video-player">
              <iframe
                src="https://www.youtube.com/embed/qKzhrXqT6oE"
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Search Box and Tabs Row */}
            <div className="lesson-search-tabs-row">
              {/* Search Box */}
              <div className="lesson-search-section">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search in this course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="lesson-search-input"
                  />
                  <button className="search-submit-btn">
                    <i className="feather-search"></i>
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="lesson-tabs-wrapper">
                <div className="rbt-inner-onepage-navigation">
                  <nav className="mainmenu-nav onepagenav">
                    <ul className="mainmenu">
                      {sidebarCollapsed && (
                        <li className={activeTab === 'course-content' ? 'current' : ''}>
                          <a href="#course-content" onClick={(e) => { e.preventDefault(); setActiveTab('course-content'); }}>
                            Course Content
                          </a>
                        </li>
                      )}
                      <li className={activeTab === 'overview' ? 'current' : ''}>
                        <a href="#overview" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
                          Overview
                        </a>
                      </li>
                      <li className={activeTab === 'qa' ? 'current' : ''}>
                        <a href="#qa" onClick={(e) => { e.preventDefault(); setActiveTab('qa'); }}>
                          Q&A
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="lesson-tab-content">
              {activeTab === 'course-content' && (
                <div id="course-content" className="tab-pane active">
                  <div className="course-sections">
                    {sections.map((section) => (
                      <div key={section.id} className="course-section">
                        <button
                          className="section-header"
                          onClick={() => toggleSection(section.id)}
                        >
                          <span className="section-title">{section.title}</span>
                          <span className="section-progress">
                            {section.completedLessons}/{section.totalLessons}
                          </span>
                          <i className={`feather-chevron-down toggle-icon ${section.isExpanded ? 'expanded' : ''}`}></i>
                        </button>

                        {section.isExpanded && (
                          <div className="section-content">
                            <ul className="lesson-list">
                              {section.lessons.map((lesson) => (
                                <li key={lesson.id} className={`lesson-item ${lesson.isCurrent ? 'current' : ''}`}>
                                  <Link to="#" className="lesson-link">
                                    <div className="lesson-content-left">
                                      <i className={getLessonIcon(lesson.type)}></i>
                                      <span className="lesson-text">{lesson.title}</span>
                                    </div>
                                    <div className="lesson-content-right">
                                      {lesson.duration && (
                                        <span className="lesson-duration">{lesson.duration}</span>
                                      )}
                                      <span className={`lesson-status ${lesson.isCompleted ? 'completed' : 'pending'}`}>
                                        <i className={lesson.isCompleted ? 'feather-check' : 'feather-circle'}></i>
                                      </span>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'overview' && (
                <div id="overview" className="tab-pane active">
                  <div className="rbt-course-feature-box overview-wrapper rbt-shadow-box mt--30 has-show-more">
                    <div className="rbt-course-feature-inner has-show-more-inner-content">
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">What you'll learn</h4>
                      </div>
                      <p>
                        Are you new to PHP or need a refresher? Then this course will help you get all the fundamentals of Procedural PHP,
                        Object Oriented PHP, MYSQLi and ending the course by building a CMS system similar to WordPress, Joomla or Drupal.
                        Knowing PHP has allowed me to make enough money to stay home and make courses like this one for students all over the world.
                      </p>

                      <div className="row g-5 mb--30">
                        <div className="col-lg-6">
                          <ul className="rbt-list-style-1">
                            <li><i className="feather-check"></i>Become an advanced, confident, and modern JavaScript developer from scratch.</li>
                            <li><i className="feather-check"></i>Have an intermediate skill level of Python programming.</li>
                            <li><i className="feather-check"></i>Have a portfolio of various data analysis projects.</li>
                            <li><i className="feather-check"></i>Use the numpy library to create and manipulate arrays.</li>
                          </ul>
                        </div>

                        <div className="col-lg-6">
                          <ul className="rbt-list-style-1">
                            <li><i className="feather-check"></i>Use the Jupyter Notebook Environment. JavaScript developer from scratch.</li>
                            <li><i className="feather-check"></i>Use the pandas module with Python to create and structure data.</li>
                            <li><i className="feather-check"></i>Have a portfolio of various data analysis projects.</li>
                            <li><i className="feather-check"></i>Create data visualizations using matplotlib and the seaborn.</li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, aliquam voluptas laudantium incidunt architecto nam excepturi provident rem laborum repellendus placeat neque aut doloremque ut ullam, veritatis nesciunt iusto officia alias, non est vitae. Eius repudiandae optio quam alias aperiam nemo nam tempora, dignissimos dicta excepturi ea quo ipsum omnis maiores perferendis commodi voluptatum facere vel vero. Praesentium quisquam iure veritatis, perferendis adipisci sequi blanditiis quidem porro eligendi fugiat facilis inventore amet delectus expedita deserunt ut molestiae modi laudantium, quia tenetur animi natus ea. Molestiae molestias ducimus pariatur et consectetur. Error vero, eum soluta delectus necessitatibus eligendi numquam hic at?
                      </p>
                    </div>
                    <div className="rbt-show-more-btn">
                      Show More
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'qa' && (
                <div id="qa" className="tab-pane active">
                  <div className="qa-section">
                    <h4>Q&A</h4>
                    <div className="qa-placeholder">
                      <i className="feather-help-circle"></i>
                      <p>Q&A section will be available soon. Ask questions and get answers from instructors and fellow students.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={`lesson-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <div className="sidebar-header-content">
                <h4 className="sidebar-title">Course Content</h4>
                <button
                  className="sidebar-toggle-btn"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  title={sidebarCollapsed ? "Show Course Content" : "Hide Course Content"}
                >
                  <i className="feather-x"></i>
                </button>
              </div>
            </div>

            <div className="lesson-search-wrapper">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search Lesson"
                  className="lesson-search-input"
                />
                <button className="search-btn">
                  <i className="feather-search"></i>
                </button>
              </div>
            </div>

            <div className="course-sections">
              {sections.map((section) => (
                <div key={section.id} className="course-section">
                  <button
                    className="section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className="section-title">{section.title}</span>
                    <span className="section-progress">
                      {section.completedLessons}/{section.totalLessons}
                    </span>
                    <i className={`feather-chevron-down toggle-icon ${section.isExpanded ? 'expanded' : ''}`}></i>
                  </button>

                  {section.isExpanded && (
                    <div className="section-content">
                      <ul className="lesson-list">
                        {section.lessons.map((lesson) => (
                          <li key={lesson.id} className={`lesson-item ${lesson.isCurrent ? 'current' : ''}`}>
                            <Link to="#" className="lesson-link">
                              <div className="lesson-content-left">
                                <i className={getLessonIcon(lesson.type)}></i>
                                <span className="lesson-text">{lesson.title}</span>
                              </div>
                              <div className="lesson-content-right">
                                {lesson.duration && (
                                  <span className="lesson-duration">{lesson.duration}</span>
                                )}
                                <span className={`lesson-status ${lesson.isCompleted ? 'completed' : 'pending'}`}>
                                  <i className={lesson.isCompleted ? 'feather-check' : 'feather-circle'}></i>
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Progress Circle */}
      {/* <div className="progress-circle">
        <svg className="progress-svg" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div> */}

      {/* Floating Toggle Button */}
      {sidebarCollapsed && (
        <div className="floating-toggle-container">
          <button
            className="floating-toggle-btn"
            onClick={() => setSidebarCollapsed(false)}
            title="Show Course Content"
          >
            <i className="feather-menu"></i>
          </button>
          <span className="floating-tooltip">Show Course Content</span>
        </div>
      )}
    </div>
  );
};

export default LessonPage;