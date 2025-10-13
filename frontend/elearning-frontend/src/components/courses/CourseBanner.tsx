import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface CourseBannerProps {
  title?: string;
  courseCount?: number;
  description?: string;
  showTopBar?: boolean;
  totalResults?: number;
  currentPage?: number;
  pageSize?: number;
  onViewChange?: (view: 'grid' | 'list') => void;
  onSortChange?: (sort: string) => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({
  title = "All Courses",
  courseCount = 50,
  description = "Courses that help beginner designers become true unicorns.",
  showTopBar = true,
  totalResults = 19,
  currentPage = 1,
  pageSize = 9,
  onViewChange,
  onSortChange
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Default');

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view);
    onViewChange?.(view);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange?.(value);
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="rbt-page-banner-wrapper">
      {/* Start Banner BG Image */}
      <div className="rbt-banner-image"></div>
      {/* End Banner BG Image */}
      <div className="rbt-banner-content">
        {/* Start Banner Content Top */}
        <div className="rbt-banner-content-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {/* Start Breadcrumb Area */}
                <ul className="page-list">
                  <li className="rbt-breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <div className="icon-right">
                      <i className="feather-chevron-right"></i>
                    </div>
                  </li>
                  <li className="rbt-breadcrumb-item active">All Courses</li>
                </ul>
                {/* End Breadcrumb Area */}

                <div className="title-wrapper">
                  <h1 className="title mb--0">{title}</h1>
                  <a href="#" className="rbt-badge-2">
                    <div className="image">🎉</div> {courseCount} Courses
                  </a>
                </div>

                <p className="description">{description}</p>
              </div>
            </div>
          </div>
        </div>
        {/* End Banner Content Top */}
        {/* Start Course Top */}
        {showTopBar && (
          <div className="rbt-course-top-wrapper mt--40">
            <div className="container">
              <div className="row g-5 align-items-center">
                <div className="col-lg-5 col-md-12">
                  <div className="rbt-sorting-list d-flex flex-wrap align-items-center">
                    <div className="rbt-short-item switch-layout-container">
                      <ul className="course-switch-layout">
                        <li className="course-switch-item">
                          <button
                            className={`rbt-grid-view ${viewMode === 'grid' ? 'active' : ''}`}
                            title="Grid Layout"
                            onClick={() => handleViewChange('grid')}
                          >
                            <i className="feather-grid"></i> <span className="text">Grid</span>
                          </button>
                        </li>
                        <li className="course-switch-item">
                          <button
                            className={`rbt-list-view ${viewMode === 'list' ? 'active' : ''}`}
                            title="List Layout"
                            onClick={() => handleViewChange('list')}
                          >
                            <i className="feather-list"></i> <span className="text">List</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="rbt-short-item">
                      <span className="course-index">
                        Showing {startItem}-{endItem} of {totalResults} results
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 col-md-12">
                  <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                    <div className="rbt-short-item">
                      <div className="filter-select">
                        <span className="select-label d-block">Short By</span>
                        <div className="filter-select rbt-modern-select rbt-native-select-wrapper search-by-category">
                          <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="rbt-native-select"
                          >
                            <option value="Default">Default</option>
                            <option value="Latest">Latest</option>
                            <option value="Popularity">Popularity</option>
                            <option value="Trending">Trending</option>
                            <option value="Price: low to high">Price: low to high</option>
                            <option value="Price: high to low">Price: high to low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End Course Top */}
      </div>
    </div>
  );
};

export default CourseBanner;