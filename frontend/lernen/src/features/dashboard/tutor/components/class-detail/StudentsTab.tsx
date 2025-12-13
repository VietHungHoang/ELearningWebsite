import React from 'react';
import { FiEye, FiChevronLeft } from 'react-icons/fi';
import type { ClassData } from '../../pages/MyClassPage';

interface StudentsTabProps {
    classData: ClassData;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ classData }) => {
    return (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
             <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Enrolled Students ({classData.students.length})</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                    <FiEye /> Message All
                </button>
            </div>
            <div className="divide-y divide-gray-200">
                {classData.students.map(student => (
                    <div key={student.id} className="p-5 hover:bg-gray-100 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-4">
                                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                <div>
                                    <p className="font-bold text-gray-800">{student.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">ID: #{student.id}</p>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-xs text-gray-400 font-medium uppercase">Contact</p>
                                <p className="text-sm text-gray-700 truncate">student{student.id}@example.com</p>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-xs text-gray-400 font-medium uppercase">Attendance</p>
                                <div className="flex items-center gap-2 mt-1">
                                     <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-green-700">90%</span>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button className="p-2 text-gray-500 hover:text-[#0b6459] hover:bg-green-50 rounded-lg transition-colors" title="Message">
                                    <FiEye />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                                    <FiChevronLeft />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentsTab;