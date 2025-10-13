import React from 'react';

interface RatingOption {
  stars: number;
  count: number;
}

interface RatingsWidgetProps {
  ratings: RatingOption[];
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
}

const RatingsWidget: React.FC<RatingsWidgetProps> = ({
  ratings,
  selectedRating,
  onRatingChange,
}) => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fas fa-star ${i < count ? '' : 'off'}`}></i>
    ));
  };

  return (
    <div className="rbt-single-widget rbt-widget-rating">
      <div className="inner">
        <h4 className="rbt-widget-title">Ratings</h4>
        <ul className="rbt-sidebar-list-wrapper rating-list-check">
          {ratings.map((rating) => (
            <li key={rating.stars} className="rbt-check-group">
              <input
                id={`rating-${rating.stars}`}
                type="radio"
                name="rating"
                checked={selectedRating === rating.stars}
                onChange={() => onRatingChange(rating.stars)}
              />
              <label htmlFor={`rating-${rating.stars}`}>
                <span className="rating">
                  {renderStars(rating.stars)}
                </span>
                <span className="rbt-lable count">{rating.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RatingsWidget;