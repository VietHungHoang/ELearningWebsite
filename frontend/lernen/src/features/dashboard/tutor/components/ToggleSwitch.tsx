import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
    return (
        <label htmlFor="toggle-switch" className="relative inline-flex items-center cursor-pointer">
            <input
                id="toggle-switch"
                type="checkbox"
                checked={enabled}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
                aria-checked={enabled}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b6459]"></div>
        </label>
    );
};

export default ToggleSwitch;