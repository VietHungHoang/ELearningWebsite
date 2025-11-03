import React from 'react';
import TutorCard from './TutorCard';

export interface Tutor {
    id: number;
    name: string;
    avatar: string;
    verified: boolean;
    specialization: string;
    specializationIcon: 'learning' | 'academic';
    rating: number;
    reviews: number;
    bookedSessions: number;
    currentSessions: number;
    languages: string;
    bio: string;
    sessionFee: number;
    videoUrl: string;
    videoThumbnail: string;
}

interface TutorListProps {
  tutors: Tutor[];
  onBookTrial: (tutor: Tutor) => void;
}

const TutorList: React.FC<TutorListProps> = ({ tutors, onBookTrial }) => {
  return (
    <div className="space-y-6">
      {tutors.map(tutor => (
        <TutorCard key={tutor.id} tutor={tutor} onBookTrial={onBookTrial} />
      ))}
    </div>
  );
};

export default TutorList;