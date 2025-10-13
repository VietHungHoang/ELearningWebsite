import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface InstructorsWidgetProps {
  instructors: FilterOption[];
  selectedInstructors: string[];
  onInstructorChange: (instructorId: string, checked: boolean) => void;
}

const InstructorsWidget: React.FC<InstructorsWidgetProps> = ({
  instructors,
  selectedInstructors,
  onInstructorChange,
}) => {
  return (
    <div className="rbt-single-widget rbt-widget-instructor">
      <div className="inner">
        <h4 className="rbt-widget-title">Instructors</h4>
        <ul className="rbt-sidebar-list-wrapper instructor-list-check">
          {instructors.map((instructor) => (
            <li key={instructor.id} className="rbt-check-group">
              <input
                id={`ins-${instructor.id}`}
                type="checkbox"
                checked={selectedInstructors.includes(instructor.id)}
                onChange={(e) => onInstructorChange(instructor.id, e.target.checked)}
              />
              <label htmlFor={`ins-${instructor.id}`}>
                {instructor.label} <span className="rbt-lable count">{instructor.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorsWidget;