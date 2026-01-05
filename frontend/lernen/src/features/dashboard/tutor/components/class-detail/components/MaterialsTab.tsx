import React from 'react';
import { FiFolder, FiPlus, FiDownload, FiTrash } from 'react-icons/fi';
import type { ClassData } from '../../../../../../services/classService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../../../context/AuthContext';

interface MaterialsTabProps {
    classData: ClassData;
}

interface Material {
    id: string;
    name: string;
    type: 'PDF' | 'Video' | 'ZIP';
    date: string;
    size?: string;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ classData }) => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const isStudent = state.user?.role === 'student';
    // Mock data for testing
    const mockMaterials: Material[] = [
        {
            id: '1',
            name: 'Introduction to React.pdf',
            type: 'PDF',
            date: 'Dec 15, 2025',
            size: '2.4 MB'
        },
        {
            id: '2',
            name: 'JavaScript Fundamentals.mp4',
            type: 'Video',
            date: 'Dec 12, 2025',
            size: '45.8 MB'
        },
        {
            id: '3',
            name: 'Project Resources.zip',
            type: 'ZIP',
            date: 'Dec 10, 2025',
            size: '12.3 MB'
        },
        {
            id: '4',
            name: 'Assignment Guidelines.pdf',
            type: 'PDF',
            date: 'Dec 8, 2025',
            size: '1.8 MB'
        },
        {
            id: '5',
            name: 'Code Examples.zip',
            type: 'ZIP',
            date: 'Dec 5, 2025',
            size: '8.7 MB'
        }
    ];

    // Use mock data if no real data or materials array is empty
    const materials = classData?.materials && classData.materials.length > 0 ? classData.materials : mockMaterials;

    if (!classData) {
        return (
            <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                        <FiFolder />
                    </div>
                    <h4 className="text-gray-800 font-bold">{t('dashboard.tutor.myClass.detail.materialsTab.loading')}</h4>
                    <p className="text-gray-500 text-sm mt-1">{t('dashboard.tutor.myClass.detail.materialsTab.loadingDescription')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.title`, { count: materials.length })}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.description`)}
                    </p>
                </div>
                {!isStudent && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors text-sm font-semibold">
                        <FiPlus className="w-4 h-4" />
                        {t('dashboard.tutor.myClass.detail.materialsTab.tutor.uploadMaterial')}
                    </button>
                )}
            </div>

            {/* Materials List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {materials && materials.length > 0 ? materials.map((material: Material) => (
                    <div key={material.id} className="p-5 hover:bg-gray-100 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center border border-indigo-100">
                                    <FiFolder />
                                </div>
                                <div>
                                     <p className="font-bold text-gray-800 truncate">{material.name}</p>
                                     <p className="text-xs text-gray-500">{material.type} • {material.size || '2.4 MB'}</p>
                                </div>
                            </div>

                            <div className="hidden md:block text-sm text-gray-500">
                                {t('dashboard.tutor.myClass.detail.materialsTab.uploadedOn', { date: material.date })}
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <button className="p-2 text-gray-500 hover:text-[#0b6459] hover:bg-gray-100 rounded-lg transition-colors" title={t('dashboard.tutor.myClass.detail.materialsTab.download')}>
                                    <FiDownload />
                                </button>
                                {!isStudent && (
                                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t('dashboard.tutor.myClass.detail.materialsTab.delete')}>
                                        <FiTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-white">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                            <FiFolder />
                        </div>
                        <h4 className="text-gray-800 font-bold">{t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.noMaterials`)}</h4>
                        <p className="text-gray-500 text-sm mt-1">{t(`dashboard.tutor.myClass.detail.materialsTab.${isStudent ? 'student' : 'tutor'}.noMaterialsDescription`)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialsTab;