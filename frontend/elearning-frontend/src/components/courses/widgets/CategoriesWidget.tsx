import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface CategoriesWidgetProps {
  categories: FilterOption[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
}

const CategoriesWidget: React.FC<CategoriesWidgetProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <div className="rbt-single-widget rbt-widget-categories has-show-more">
      <div className="inner">
        <h4 className="rbt-widget-title">Categories</h4>
        <ul className="rbt-sidebar-list-wrapper categories-list-check has-show-more-inner-content">
          {categories.map((category) => (
            <li key={category.id} className="rbt-check-group">
              <input
                id={`cat-${category.id}`}
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => onCategoryChange(category.id, e.target.checked)}
              />
              <label htmlFor={`cat-${category.id}`}>
                {category.label} <span className="rbt-lable count">{category.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="rbt-show-more-btn">Show More</div>
    </div>
  );
};

export default CategoriesWidget;