import React, { useState } from 'react';
import { FiUserPlus, FiTrash2, FiMessageCircle, FiSearch } from 'react-icons/fi';
import ModalLayout from '../../../../../../components/ui/ModalLayout';
import type { ClassData } from '../../../my-class/MyClassPage';
import { useTranslation } from 'react-i18next';

interface StudentsTabProps {
    classData: ClassData;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ classData }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSearchTerm('');
    };
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Học viên ({classData.students.length})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Quản lý học viên trong lớp học
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold"
                >
                    <FiUserPlus className="w-4 h-4" />
                    Thêm học viên
                </button>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {classData.students.length === 0 ? (
                    <div className="p-8 text-center">
                        <FiUserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-gray-900 font-medium mb-2">Chưa có học viên</h4>
                        <p className="text-gray-600 text-sm">Thêm học viên đầu tiên để bắt đầu</p>
                    </div>
                ) : (
                    classData.students.map((student: any) => {
                        // Đảm bảo luôn có tên hợp lệ
                        const studentName = student.name || student.fullName || `Học viên ${student.id}`;
                        const studentEmail = student.email || 
                            (studentName 
                                ? `${studentName.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@example.com` 
                                : `${student.id}@example.com`);
                        
                        return (
                        <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#0b6459] rounded-full flex items-center justify-center text-white font-medium">
                                        {studentName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {studentName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {studentEmail}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Gửi tin nhắn">
                                        <FiMessageCircle className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa học viên">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })
                )}
            </div>

            {/* Add Student Modal */}
            <ModalLayout
                isOpen={isModalOpen}
                onClose={closeModal}
                maxWidth="md"
                showCloseButton={true}
            >
                <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Thêm học viên</h3>

                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm học viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 hover:shadow-sm focus:outline-none focus:border-[#0b6459] transition-colors duration-300 w-full"
                        />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {/* Mock search results - you can replace with actual search logic */}
                        {searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Tính năng tìm kiếm sẽ được triển khai</p>
                                <p className="text-sm">Đang tìm kiếm: "{searchTerm}"</p>
                            </div>
                        )}
                        {!searchTerm && (
                            <div className="text-center py-8 text-gray-500">
                                <FiUserPlus className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Nhập để tìm kiếm học viên</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                        >
                            Hủy
                        </button>
                        <button className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors font-semibold text-sm">
                            Thêm đã chọn
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
};

export default StudentsTab;