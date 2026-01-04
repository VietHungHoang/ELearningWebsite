
import React from 'react';

interface LernenLogoProps {
    variant?: 'default' | 'white';
    className?: string;
}

export const LernenLogo: React.FC<LernenLogoProps> = ({ variant = 'default', className = '' }) => {
    const logoSrc = variant === 'white' ? "/images/logo-default.svg" : "/images/logo-default.svg";
    return <img src={logoSrc} alt="Lernen Logo" className={className} />;
};