import React, { useState } from "react";
import type { BasicCreationCourse } from "../../../types";
import useCategories from "../../../hooks/useCategories";
import StepCard from "./StepCard";
import BackButton from "./BackButton";
import NextButton from "./NextButton";
import { getCategoryIcon } from "../../../utils/iconMapping";

const Step2Category: React.FC<{
    data: BasicCreationCourse;
    onUpdate: (data: Partial<BasicCreationCourse>) => void;
    onNext: () => void;
    onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
    const [category, setCategory] = useState(data.category);
    const { categories, loading, error, refetch } = useCategories();

    const handleNext = () => {
        if (category) {
            onUpdate({ category });
            onNext();
        }
    };

    const handleRetry = () => {
        refetch();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <StepCard
                step={2}
                title="Khóa học của bạn thuộc danh mục nào?" 
                description="Chọn danh mục phù hợp nhất với nội dung khóa học."  />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#065A46] border-t-transparent"></div>
                        <span className="ml-3 text-gray-600">Đang tải danh mục...</span>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium">Không thể tải danh mục</p>
                            <p className="text-sm text-gray-500 mt-2">{error}</p>
                        </div>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-[#065A46] text-white rounded-xl font-medium hover:bg-[#054A3A] transition-colors cursor-pointer"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {!loading && !error && categories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id.toString())}
                                className={`p-4 text-left border rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                                    category === cat.id.toString()
                                        ? "border-[#065A46] bg-[#065A46]/5 text-[#065A46] shadow-lg"
                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <span className="text-2xl">{getCategoryIcon(cat.icon)}</span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                                        <p className="text-sm text-gray-500">{cat.description || "Không có mô tả"}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {!loading && !error && categories.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-lg font-medium">Không có danh mục nào</p>
                            <p className="text-sm text-gray-400 mt-2">Vui lòng liên hệ quản trị viên</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <BackButton onBack={onBack} />
                    <NextButton onNext={handleNext} disabled={!category || loading} />
                </div>
            </div>
        </div>
    );
};

export default Step2Category;
