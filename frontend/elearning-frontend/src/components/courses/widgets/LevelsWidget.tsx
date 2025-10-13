import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface LevelsWidgetProps {
  levels: FilterOption[];
  selectedLevels: string[];
  onLevelChange: (levelId: string, checked: boolean) => void;
}

const LevelsWidget: React.FC<LevelsWidgetProps> = ({
  levels,
  selectedLevels,
  onLevelChange,
}) => {
  return (
    <div className="rbt-single-widget rbt-widget-lavels">
      <div className="inner">
        <h4 className="rbt-widget-title">Levels</h4>
        <ul className="rbt-sidebar-list-wrapper lavels-list-check">
          {levels.map((level) => (
            <li key={level.id} className="rbt-check-group">
              <input
                id={`level-${level.id}`}
                type="checkbox"
                checked={selectedLevels.includes(level.id)}
                onChange={(e) => onLevelChange(level.id, e.target.checked)}
              />
              <label htmlFor={`level-${level.id}`}>
                {level.label}<span className="rbt-lable count">{level.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LevelsWidget;