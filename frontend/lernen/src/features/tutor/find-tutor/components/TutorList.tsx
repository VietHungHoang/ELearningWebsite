import React from 'react';
import TutorCard from './TutorCard';
import type { Tutor } from '../../../../types/api';

interface TutorListProps {
  tutors: Tutor[];
  onBookTrial: (tutor: Tutor) => void;
}

const TutorList: React.FC<TutorListProps> = ({ tutors, onBookTrial }) => {
  return (
    <div className="space-y-4">
      {tutors.map(tutor => (
        <TutorCard key={tutor.id} tutor={tutor} onBookTrial={onBookTrial} />
      ))}
    </div>
  );
};

export default TutorList;