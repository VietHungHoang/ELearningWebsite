import React from 'react';
import { InteractiveImagePanel } from "./InteractiveImagePanel.tsx";
import { LernenLogo } from "../LernenLogo.tsx";


const IntroducePanel: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#0b6459] via-teal-700 to-[#0b6459] text-white p-6 lg:rounded-2xl shadow-2xl flex flex-col justify-between relative h-full min-h-[480px] max-h-[560px] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            
            <div className="relative z-10">
                <LernenLogo />
                <div className="mt-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold">4k+ Registered Tutors</span>
                    </div>
                    <h1 className="text-xl font-bold mt-4 leading-tight">Yes! we're making progress!</h1>
                    <p className="text-sm mt-2 text-teal-100">every minute & every second</p>
                </div>
            </div>

            <div className="relative z-10 my-5 flex-1 flex items-center justify-center">
                <InteractiveImagePanel />
            </div>

            <div className="relative z-10 flex items-end mt-4">
                <p className="text-xs text-teal-50 leading-relaxed font-medium">Begin your learning journey today and experience the transformative power of personalized education.</p>
            </div>
        </div>
    );
};
export default IntroducePanel;