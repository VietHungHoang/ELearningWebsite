import React from 'react';
import { FiFolder, FiPlus, FiDownload, FiTrash } from 'react-icons/fi';
import type { ClassData } from '../../pages/MyClassPage';

interface MaterialsTabProps {
    classData: ClassData;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ classData }) => {
    return (
         <div className="bg-gray-50 rounded-xl overflow-hidden">
             <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Class Materials</h3>
                <button className="flex items-center gap-2 text-sm font-semibold text-[#0b6459] hover:text-[#084c43]">
                    <FiPlus /> Upload Material
                </button>
            </div>
            <div className="divide-y divide-gray-200">
                {classData.materials.length > 0 ? classData.materials.map(material => (
                    <div key={material.id} className="p-5 hover:bg-gray-100 transition-colors bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center border border-indigo-100">
                                    <FiFolder />
                                </div>
                                <div>
                                     <p className="font-bold text-gray-800 truncate">{material.name}</p>
                                     <p className="text-xs text-gray-500">{material.type} • 2.4 MB</p>
                                </div>
                            </div>

                            <div className="hidden md:block text-sm text-gray-500">
                                Uploaded on {material.date}
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <button className="p-2 text-gray-500 hover:text-[#0b6459] hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                    <FiDownload />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <FiTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-white">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
                            <FiFolder />
                        </div>
                        <h4 className="text-gray-800 font-bold">No materials yet</h4>
                        <p className="text-gray-500 text-sm mt-1">Upload documents, videos, or links for your students.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialsTab;