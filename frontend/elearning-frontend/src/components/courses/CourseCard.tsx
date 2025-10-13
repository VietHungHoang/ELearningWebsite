import React from 'react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  lessonCount: number;
  studentCount: number;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  onBookmark?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  image,
  rating,
  reviewCount,
  lessonCount,
  studentCount,
  description,
  author,
  category,
  currentPrice,
  originalPrice,
  discount,
  onBookmark,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? '' : 'off'}`}></i>
    ));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    onBookmark?.(id);
  };

  return (
    <div className="rbt-card variation-01 rbt-hover">
      <div className="rbt-card-img">
        <Link to={`/course/${id}`}>
          <img src={image} alt="Card image" />
          {discount && (
            <div className="rbt-badge-3 bg-white">
              <span>-{discount}%</span>
              <span>Off</span>
            </div>
          )}
        </Link>
      </div>
      <div className="rbt-card-body">
        <div className="rbt-card-top">
          <div className="rbt-review">
            <div className="rating">
              {renderStars(rating)}
            </div>
            <span className="rating-count"> ({reviewCount} Reviews)</span>
          </div>
          <div className="rbt-bookmark-btn">
            <a
              className="rbt-round-btn"
              title="Bookmark"
              href="#"
              onClick={handleBookmark}
            >
              <i className="feather-bookmark"></i>
            </a>
          </div>
        </div>

        <h4 className="rbt-card-title">
          <Link to={`/course/${id}`}>{title}</Link>
        </h4>

        <ul className="rbt-meta">
          <li>
            <i className="feather-book"></i>
            {lessonCount} Lessons
          </li>
          <li>
            <i className="feather-users"></i>
            {studentCount} Students
          </li>
        </ul>

        <p className="rbt-card-text">{description}</p>

          <div className="rbt-author-meta mb--10">
          <div className="rbt-avater">
            <Link to={`/profile/${author.name.toLowerCase()}`}>
              <img src={author.avatar} alt={author.name} />
            </Link>
          </div>
          <div className="rbt-author-info">
            By <Link to={`/profile/${author.name.toLowerCase()}`}>{author.name}</Link> In{' '}
            <Link to={`/category/${category.toLowerCase()}`}>{category}</Link>
          </div>
        </div>

        <div className="rbt-card-bottom">
          <div className="rbt-price">
            <span className="current-price">${currentPrice}</span>
            {originalPrice && (
              <span className="off-price">${originalPrice}</span>
            )}
          </div>
            <Link className="rbt-btn-link" to={`/course/${id}`}>
              Learn More
              <i className="feather-arrow-right"></i>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;