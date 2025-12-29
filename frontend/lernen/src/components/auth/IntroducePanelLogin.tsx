import React from 'react';
import { LernenLogo } from "../LernenLogo.tsx";
import { InteractiveImagePanelLogin } from './InteractiveImagePanelLogin.tsx';


const IntroducePanelLogin: React.FC = () => {
    return (
        <div className="bg-[#0b6459] text-white p-8 rounded-2xl lg:rounded-l-2xl lg:rounded-tr-[100px] lg:rounded-br-[100px] flex flex-col justify-around relative">
            <div>
                <LernenLogo />
                <h1 className="text-3xl font-bold mt-8">Yes! we're making progress!</h1>
                <p className="text-lg mt-2 text-gray-200">every minute & every second</p>
            </div>

            <div className="my-8">
                <InteractiveImagePanelLogin />
            </div>

            <div className="flex items-end mt-8">
                <p className="text-base text-gray-200">Begin your learning journey today and experience the transformative power of personalized education.</p>
            </div>
        </div>
    );
};
export default IntroducePanelLogin;