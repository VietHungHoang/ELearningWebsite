import React from 'react';
import {
  SearchWidget,
  CategoriesWidget,
  RatingsWidget,
  InstructorsWidget,
  PricesWidget,
  LevelsWidget,
} from './widgets';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface RatingOption {
  stars: number;
  count: number;
}

interface CourseSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  selectedInstructors: string[];
  onInstructorChange: (instructors: string[]) => void;
  selectedPrices: string[];
  onPriceChange: (prices: string[]) => void;
  selectedLevels: string[];
  onLevelChange: (levels: string[]) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  selectedInstructors,
  onInstructorChange,
  selectedPrices,
  onPriceChange,
  selectedLevels,
  onLevelChange,
}) => {
  const categories: FilterOption[] = [
    { id: 'art-humanities', label: 'Art & Humanities', count: 15 },
    { id: 'web-design', label: 'Web Design', count: 20 },
    { id: 'graphic-design', label: 'Graphic Design', count: 10 },
    { id: 'technology', label: 'Technology', count: 20 },
    { id: 'humanities-art', label: 'Humanities Art', count: 25 },
    { id: 'management', label: 'Management', count: 50 },
    { id: 'photoshop', label: 'Photoshop', count: 45 },
    { id: 'online-course', label: 'Online Course', count: 45 },
    { id: 'english-club', label: 'English Club', count: 45 },
    { id: 'graphic-design-2', label: 'Graphic Design', count: 45 },
  ];

  const ratings: RatingOption[] = [
    { stars: 5, count: 5 },
    { stars: 4, count: 4 },
    { stars: 3, count: 3 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];

  const instructors: FilterOption[] = [
    { id: 'slaughter', label: 'Slaughter', count: 15 },
    { id: 'patrick', label: 'Patrick', count: 20 },
    { id: 'angela', label: 'Angela', count: 10 },
    { id: 'fatima-asrafy', label: 'Fatima Asrafy', count: 15 },
  ];

  const prices: FilterOption[] = [
    { id: 'all', label: 'All', count: 15 },
    { id: 'free', label: 'Free', count: 0 },
    { id: 'paid', label: 'Paid', count: 10 },
  ];

  const levels: FilterOption[] = [
    { id: 'all-levels', label: 'All Levels', count: 15 },
    { id: 'beginner', label: 'Beginner', count: 0 },
    { id: 'intermediate', label: 'Intermediate', count: 10 },
    { id: 'expert', label: 'Expert', count: 10 },
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      onCategoryChange([...selectedCategories, categoryId]);
    } else {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleInstructorChange = (instructorId: string, checked: boolean) => {
    if (checked) {
      onInstructorChange([...selectedInstructors, instructorId]);
    } else {
      onInstructorChange(selectedInstructors.filter(id => id !== instructorId));
    }
  };

  const handlePriceChange = (priceId: string, checked: boolean) => {
    if (checked) {
      onPriceChange([...selectedPrices, priceId]);
    } else {
      onPriceChange(selectedPrices.filter(id => id !== priceId));
    }
  };

  const handleLevelChange = (levelId: string, checked: boolean) => {
    if (checked) {
      onLevelChange([...selectedLevels, levelId]);
    } else {
      onLevelChange(selectedLevels.filter(id => id !== levelId));
    }
  };

  return (
    <aside className="rbt-sidebar-widget-wrapper">
      <SearchWidget
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <CategoriesWidget
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />

      <RatingsWidget
        ratings={ratings}
        selectedRating={selectedRating}
        onRatingChange={onRatingChange}
      />

      <InstructorsWidget
        instructors={instructors}
        selectedInstructors={selectedInstructors}
        onInstructorChange={handleInstructorChange}
      />

      <PricesWidget
        prices={prices}
        selectedPrices={selectedPrices}
        onPriceChange={handlePriceChange}
      />

      <LevelsWidget
        levels={levels}
        selectedLevels={selectedLevels}
        onLevelChange={handleLevelChange}
      />
    </aside>
  );
};

export default CourseSidebar;