import React from 'react';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { useTranslation } from 'react-i18next';
import type { GroupClass } from '../../../../types/tutor';

interface LastStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedClass: GroupClass | null;
    onConfirm: () => void;
}

const LastStudentModal: React.FC<LastStudentModalProps> = ({
    isOpen,
    onClose,
    selectedClass,
    onConfirm,
}) => {
    const { t } = useTranslation();

    if (!selectedClass) return null;

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="lg"
        >
            <div>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {t('tutorDetail.groupClass.lastStudent.title')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {t('tutorDetail.groupClass.lastStudent.subtitle')}
                    </p>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Steps */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#0b6459] text-white flex items-center justify-center text-sm font-bold">1</div>
                            <span className="text-sm font-semibold text-gray-900">
                                {t('tutorDetail.groupClass.register')}
                            </span>
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-sm font-medium text-gray-500">
                                {t('tutorDetail.groupClass.payment')}
                            </span>
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
                            <span className="text-sm font-medium text-gray-500">
                                {t('tutorDetail.groupClass.start')}
                            </span>
                        </div>
                    </div>

                    {/* Class Info */}
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <p className="text-lg font-bold text-gray-900">{selectedClass.title}</p>
                            {(selectedClass as any).price && (
                                <span className="font-bold text-[#0b6459] text-2xl flex-shrink-0">
                                    {t('common.currency')}{(selectedClass as any).price}
                                    {(selectedClass as any).sessions && (
                                        <span className="text-sm text-gray-600 font-medium">
                                            /{(selectedClass as any).sessions}
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {(selectedClass as any).level && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                    {(selectedClass as any).level}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Special Notice for Last Student */}
                    <div className="bg-gradient-to-r from-[#0b6459] to-[#084c43] rounded-lg p-5 text-white">
                        <div className="flex gap-3">
                            <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-base font-bold text-white mb-2">
                                    {t('tutorDetail.groupClass.lastStudent.specialNotice')}
                                </p>
                                <ul className="space-y-2 text-sm text-white/90">
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>{t('tutorDetail.groupClass.lastStudent.notice1')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>{t('tutorDetail.groupClass.lastStudent.notice2')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-0.5">•</span>
                                        <span>{t('tutorDetail.groupClass.lastStudent.notice3')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2.5 pt-3 border-t border-gray-100">
                        {selectedClass.schedule && selectedClass.schedule.length > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('tutorDetail.groupClass.schedule')}</span>
                                <span className="text-gray-900 font-medium text-right">
                                    {selectedClass.schedule.map((s, idx) => {
                                        const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                                        const dayKey = dayKeys[s.dayOfWeek - 1];
                                        const dayName = t(`common.days.${dayKey}`);
                                        return idx === 0 
                                            ? `${dayName} ${s.time}`
                                            : `, ${dayName} ${s.time}`;
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {t('tutorDetail.groupClass.studentsEnrolledLabel')}
                            </span>
                            <span className="text-gray-900 font-medium">
                                {selectedClass.enrolledStudents ?? selectedClass.students?.length ?? 0} / {selectedClass.maxStudents}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
                    >
                        {t('tutorDetail.groupClass.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] text-sm font-semibold transition-colors"
                    >
                        {t('tutorDetail.groupClass.lastStudent.confirmJoin')}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default LastStudentModal;

