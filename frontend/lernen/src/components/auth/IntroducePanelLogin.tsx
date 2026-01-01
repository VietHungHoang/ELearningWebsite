import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { InteractiveImagePanelLogin } from './InteractiveImagePanelLogin.tsx';


const IntroducePanelLogin: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-[#0b6459] text-white p-8 rounded-2xl lg:rounded-l-2xl lg:rounded-tr-[100px] lg:rounded-br-[100px] flex flex-col justify-around relative">
            <div>
                <NavLink to="/" className="inline-block cursor-pointer">
                    <img src="/images/logo-white.svg" alt="Lernen Logo" />
                </NavLink>
                <h1 className="text-3xl font-bold mt-8">{t('auth.signup.introPanel.title')}</h1>
                <p className="text-lg mt-2 text-gray-200">{t('auth.signup.introPanel.subtitle')}</p>
            </div>

            <div className="my-8">
                <InteractiveImagePanelLogin />
            </div>

            <div className="flex items-end mt-8">
                <p className="text-base text-gray-200">{t('auth.signup.introPanel.description')}</p>
            </div>
        </div>
    );
};
export default IntroducePanelLogin;