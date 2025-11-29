import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import EnrollmentTypeBadge from './EnrollmentTypeBadge';
import type { Student } from '../../../../../types/api';
import StudentStatusBadge from '../../components/StudentStatusBadge';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getMockCoursesForStudent = (student: Student) => {
    const courses: {title: string, type: '1-on-1' | 'Group' | 'Trial'}[] = [];
    if (student.enrollmentTypes.includes('1-on-1')) {
        courses.push({title: 'Personalized Math Tutoring', type: '1-on-1'});
    }
    if (student.enrollmentTypes.includes('Group')) {
        courses.push({title: 'Group Physics Workshop', type: 'Group'});
    }
    if (student.enrollmentTypes.includes('Trial')) {
        courses.push({title: 'Introduction to Algebra Course', type: 'Trial'});
    }
    if(courses.length === 0) { // Add a default if no types are specified
        courses.push({title: 'General Studies', type: '1-on-1'});
    }
    return courses;
  }
  const enrolledCourses = getMockCoursesForStudent(student);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
      role="dialog" aria-modal="true"
    >
      <style>{`
        @keyframes modal-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
        @keyframes modal-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
        .animate-modal-out { animation: modal-out 0.3s ease-in forwards; }
      `}</style>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-800">Student Details</h2>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiX className="w-5 h-5" /></button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
                <img src={student.avatarUrl} alt={student.name} className="w-20 h-20 rounded-full" />
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                    <div className="mt-1"><StudentStatusBadge status={student.status} /></div>
                </div>
            </div>
            
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                    <p className="text-gray-500 font-medium">Email Address</p>
                    <p className="text-gray-800 font-semibold">{student.email}</p>
                </div>
                 <div>
                    <p className="text-gray-500 font-medium">Registered Date</p>
                    <p className="text-gray-800 font-semibold">{student.registeredDate}</p>
                </div>
            </div>

            {/* Enrolled Courses */}
            <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">Enrolled Courses</h4>
                <div className="space-y-3">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-700 text-sm">{course.title}</p>
                            <EnrollmentTypeBadge type={course.type} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
            <button onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
