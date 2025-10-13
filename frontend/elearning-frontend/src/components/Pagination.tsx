import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={i === currentPage ? 'active' : ''}>
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageClick(i); }}>
            {i}
          </a>
        </li>
      );
    }
    return pages;
  };

  return (
    <div className="row">
      <div className="col-lg-12 mt--60">
        <nav>
          <ul className="rbt-pagination">
            <li>
              <a
                href="#"
                aria-label="Previous"
                onClick={(e) => { e.preventDefault(); handlePageClick(currentPage - 1); }}
                className={currentPage === 1 ? 'disabled' : ''}
              >
                <i className="feather-chevron-left"></i>
              </a>
            </li>
            {renderPageNumbers()}
            <li>
              <a
                href="#"
                aria-label="Next"
                onClick={(e) => { e.preventDefault(); handlePageClick(currentPage + 1); }}
                className={currentPage === totalPages ? 'disabled' : ''}
              >
                <i className="feather-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;