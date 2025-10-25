import React from 'react';
import { InteractiveImagePanel } from "./InteractiveImagePanel.tsx";
import { LernenLogo } from "../../icon/LernenLogo.tsx";


const IntroducePanel: React.FC = () => {
    return (
        <div className="bg-[#0b6459] text-white p-8 lg:rounded-tr-[100px] lg:rounded-br-[100px] flex flex-col justify-around relative">
            <div>
                <LernenLogo />
                <h1 className="text-2xl font-bold mt-8">Yes! we're making progress!</h1>
                <p className="text-base mt-2 text-gray-200">every minute & every second</p>
            </div>

            <div className="my-8">
                <InteractiveImagePanel />
            </div>

            <div className="flex items-end mt-8">
                <p className="text-gray-200">Begin your learning journey today and experience the transformative power of personalized education.</p>
            </div>
        </div>
    );
};
export default IntroducePanel;