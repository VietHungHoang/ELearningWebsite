import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface PricesWidgetProps {
  prices: FilterOption[];
  selectedPrices: string[];
  onPriceChange: (priceId: string, checked: boolean) => void;
}

const PricesWidget: React.FC<PricesWidgetProps> = ({
  prices,
  selectedPrices,
  onPriceChange,
}) => {
  return (
    <div className="rbt-single-widget rbt-widget-prices">
      <div className="inner">
        <h4 className="rbt-widget-title">Prices</h4>
        <ul className="rbt-sidebar-list-wrapper prices-list-check">
          {prices.map((price) => (
            <li key={price.id} className="rbt-check-group">
              <input
                id={`price-${price.id}`}
                type="checkbox"
                checked={selectedPrices.includes(price.id)}
                onChange={(e) => onPriceChange(price.id, e.target.checked)}
              />
              <label htmlFor={`price-${price.id}`}>
                {price.label} <span className="rbt-lable count">{price.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricesWidget;