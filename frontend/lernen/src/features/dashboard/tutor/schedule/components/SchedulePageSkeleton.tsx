import React from 'react';
import { useTranslation } from 'react-i18next';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

// Calendar Skeleton Component
export const CalendarSkeleton: React.FC = () => {
  const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`);

  return (
    <div className="overflow-x-auto relative">
      <div className={`grid min-w-[400px]`} style={{ gridTemplateColumns: `auto repeat(7, 1fr)` }}>
        {/* Time Column Header */}
        <div className="sticky left-0 bg-white z-10"></div>
        {/* Day Headers Skeleton */}
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="text-center p-3 border-b border-gray-200">
            <Skeleton className="h-4 w-12 mx-auto mb-2" />
            <Skeleton className="h-6 w-8 mx-auto" />
          </div>
        ))}

        {/* Time Slots and Availability Grid Skeleton */}
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="text-right pr-4 py-2 border-r border-gray-200 text-xs text-gray-500 sticky left-0 bg-white z-10 h-12 flex items-center justify-end">
              <Skeleton className="h-4 w-12" />
            </div>
            {/* Day Cells - All filled with skeleton */}
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="calendar-cell border-b border-r border-gray-200 h-12 p-1"
              >
                <div className="h-full w-full bg-gray-100 rounded opacity-50" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Monthly Calendar Skeleton Component
export const MonthlyCalendarSkeleton: React.FC = () => {
  const { t } = useTranslation();
  const weekDayHeaders = [
    t('dashboard.tutor.schedule.days.mon'),
    t('dashboard.tutor.schedule.days.tue'),
    t('dashboard.tutor.schedule.days.wed'),
    t('dashboard.tutor.schedule.days.thu'),
    t('dashboard.tutor.schedule.days.fri'),
    t('dashboard.tutor.schedule.days.sat'),
    t('dashboard.tutor.schedule.days.sun')
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {weekDayHeaders.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5">
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className="h-28 p-2 border-r border-b border-gray-200"
          >
            <Skeleton className="h-4 w-6 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;