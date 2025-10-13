import React from 'react';

interface SearchWidgetProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="rbt-single-widget rbt-widget-search">
      <div className="inner">
        <form action="#" className="rbt-search-style-1">
          <input
            type="text"
            placeholder="Search Courses"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <i className="feather-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchWidget;