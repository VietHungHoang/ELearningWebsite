import React from "react";

interface LoadingOverlayProps {
    sessionStarting: boolean;
    t: any;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ sessionStarting, t }) => {
    if (!sessionStarting) return null;

    return (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="flex items-center gap-3">
                <div
                    className="animate-spin rounded-full border-b-2 border-[#0b6459] flex-none"
                    style={{ width: 32, height: 32 }}
                ></div>
                <span className="text-lg font-medium text-white">{t("dashboard.tutor.startingSession")}</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;