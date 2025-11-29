import React, { useEffect, useRef, useState } from 'react';
import { HiX, HiPlay, HiCalendar } from 'react-icons/hi';

interface Session {
  id: number;
  title: string;
  date: Date;
  studentName: string;
  studentAvatar: string;
}

interface TutorSessionDetailModalProps {
  session: Session;
  position: { top: number; left: number };
  onClose: () => void;
}

const TutorSessionDetailModal: React.FC<TutorSessionDetailModalProps> = ({ session, position, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLeft, setIsLeft] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);
    
    useEffect(() => {
        if(modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setIsLeft(rect.left < 0);
        }
    }, [position]);

    const formattedDate = session.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = session.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div 
            ref={modalRef}
            className="fixed z-30 w-80 bg-white rounded-xl shadow-2xl border border-gray-200/80 p-5"
            style={{ top: position.top, left: position.left }}
        >
            <div className={`absolute top-4 w-4 h-4 bg-white border-b border-l border-gray-200/80 transform rotate-45 ${isLeft ? '-right-2' : '-left-2'}`}></div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{session.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
                </div>
                <button onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <HiX className="w-4 h-4" />
                </button>
            </div>
            
            <div className="flex items-center gap-3 my-4">
                <img src={session.studentAvatar} alt={session.studentName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{session.studentName}</p>
                    <p className="text-xs text-gray-500">Student</p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-gray-700">{formattedTime}</p>
            </div>
            
            <div className="mt-4 flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
                    <HiPlay className="w-4 h-4" />
                    Start Class
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    <HiCalendar className="w-4 h-4" />
                    Reschedule
                </button>
            </div>
        </div>
    );
};

export default TutorSessionDetailModal;
