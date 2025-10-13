import React, { useState } from 'react';
import Header from '../components/Header';
import { CourseBanner, CourseSidebar, CourseCard } from '../components/courses';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';

const CourseListPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(2); // Match HTML template (page 2 is active)
  const totalPages = 3; // Match HTML template (1, 2, 3)

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  const handleSortChange = (option: string) => {
    // TODO: Implement sorting logic
    console.log('Sort by:', option);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: Implement page change logic (fetch new data, etc.)
    console.log('Page changed to:', page);
  };

  // Sample course data
  const courses = [
    {
      id: '1',
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      rating: 5,
      reviewCount: 15,
      lessonCount: 12,
      studentCount: 50,
      description: 'It is a long established fact that a reader will be distracted.',
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
      },
      category: 'Development',
      currentPrice: 60,
      originalPrice: 120,
      discount: 40,
    },
    {
      id: '2',
      title: 'PHP Beginner Advanced',
      image: '/assets/images/course/course-online-02.jpg',
      rating: 5,
      reviewCount: 15,
      lessonCount: 12,
      studentCount: 50,
      description: 'It is a long established fact that a reader will be distracted.',
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
      },
      category: 'Development',
      currentPrice: 60,
      originalPrice: 120,
      discount: 40,
    },
    {
      id: '3',
      title: 'Angular Zero to Mastery',
      image: '/assets/images/course/course-online-03.jpg',
      rating: 5,
      reviewCount: 5,
      lessonCount: 8,
      studentCount: 30,
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      author: {
        name: 'Slaughter',
        avatar: '/assets/images/client/avatar-03.png',
      },
      category: 'Languages',
      currentPrice: 80,
      originalPrice: 100,
      discount: 10,
    },
    {
      id: '4',
      title: 'Web Front To Back',
      image: '/assets/images/course/course-online-04.jpg',
      rating: 5,
      reviewCount: 15,
      lessonCount: 20,
      studentCount: 40,
      description: 'Web Js long fact that a reader will be distracted by the readable.',
      author: {
        name: 'Patrick',
        avatar: '/assets/images/client/avater-01.png',
      },
      category: 'Languages',
      currentPrice: 60,
      originalPrice: 120,
      discount: 40,
    },
    {
      id: '5',
      title: 'SQL Beginner Advanced',
      image: '/assets/images/course/course-online-05.jpg',
      rating: 5,
      reviewCount: 15,
      lessonCount: 12,
      studentCount: 50,
      description: 'It is a long established fact that a reader will be distracted by the readable.',
      author: {
        name: 'Angela',
        avatar: '/assets/images/client/avatar-02.png',
      },
      category: 'Development',
      currentPrice: 60,
      originalPrice: 120,
      discount: 20,
    },
    {
      id: '6',
      title: 'JS Zero to Mastery',
      image: '/assets/images/course/course-online-06.jpg',
      rating: 5,
      reviewCount: 5,
      lessonCount: 8,
      studentCount: 30,
      description: 'Angular Js long fact that a reader will be distracted by the readable.',
      author: {
        name: 'Slaughter',
        avatar: '/assets/images/client/avatar-03.png',
      },
      category: 'Languages',
      currentPrice: 80,
      originalPrice: 100,
      discount: 10,
    },
  ];

  const handleBookmark = (courseId: string) => {
    console.log('Bookmark course:', courseId);
    // TODO: Implement bookmark functionality
  };

  return (
    <main>
      <Header />
      <CourseBanner
        title="All Courses"
        courseCount={50}
        description="Courses that help beginner designers become true unicorns."
        showTopBar={true}
        totalResults={courses.length}
        currentPage={currentPage}
        pageSize={9}
        onViewChange={handleViewChange}
        onSortChange={handleSortChange}
      />

      {/* Course list content */}
      <div className="rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row row--30 gy-5">
            <div className="col-lg-3 order-2 order-lg-1">
              <CourseSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                selectedInstructors={selectedInstructors}
                onInstructorChange={setSelectedInstructors}
                selectedPrices={selectedPrices}
                onPriceChange={setSelectedPrices}
                selectedLevels={selectedLevels}
                onLevelChange={setSelectedLevels}
              />
            </div>
            <div className="col-lg-9 order-1 order-lg-2">
              <div className={`rbt-course-grid-column ${currentView === 'list' ? 'active-list-view' : 'active-grid-view'}`} >
                  {courses.map((course) => (
                      <div key={course.id} className="course-grid-3">
                        <CourseCard
                          {...course}
                          onBookmark={handleBookmark}
                        />
                      </div>
                  ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CourseListPage;