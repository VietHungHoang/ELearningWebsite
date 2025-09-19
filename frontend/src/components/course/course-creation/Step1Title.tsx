import React, { useState } from "react";
import type { BasicCreationCourse } from "../../../types";
import StepCard from "./StepCard";
import NextButton from "./NextButton";

const Step1Title: React.FC<{
    data: BasicCreationCourse;
    onUpdate: (data: Partial<BasicCreationCourse>) => void;
    onNext: () => void;
}> = ({ data, onUpdate, onNext }) => {
    const [title, setTitle] = useState(data.title);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleNext = () => {
        if (title.trim()) {
            onUpdate({ title });
            onNext();
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <StepCard
                step={1}
                title="Tên khóa học của bạn là gì?" 
                description="Đừng lo lắng, bạn có thể thay đổi sau này." />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề khóa học</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && title.trim()) {
                                    handleNext();
                                }
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#065A46] focus:shadow-[0_0_0_3px_rgba(6,90,70,0.1)] hover:border-gray-300 transition-all duration-300 text-lg text-gray-900 placeholder-gray-500"
                            maxLength={120}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">Tạo một tiêu đề hấp dẫn để thu hút học viên</p>
                            <span className="text-sm text-gray-400">{title.length}/120</span>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div></div>
                        <NextButton 
                            onNext={handleNext} 
                            disabled={!title.trim()} 
                            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1Title;
