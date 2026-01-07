
import React from 'react';

interface LernenLogoProps {
    variant?: 'default' | 'white';
    className?: string;
    clickable?: boolean;
    onClick?: () => void;
}

export const LernenLogo: React.FC<LernenLogoProps> = ({
    variant = 'default',
    className = '',
    clickable = false,
    onClick
}) => {
    const logoSrc = variant === 'white' ? "/images/logo-default.svg" : "/images/logo-default.svg";

    return (
        <img
            src={logoSrc}
            alt="Lernen Logo"
            className={`${className} ${clickable || onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        />
    );
};