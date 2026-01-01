import React from "react";

interface BirdLoadingProps {
    /**
     * Optional title text to display below the bird animation
     * @default "Loading..."
     */
    title?: string;

    /**
     * Optional description text to display below the title
     */
    description?: string;

    /**
     * Size variant of the bird loader
     * @default "md"
     */
    size?: "sm" | "md" | "lg";

    /**
     * Custom className for the container
     */
    className?: string;
}

const BirdLoading: React.FC<BirdLoadingProps> = ({
    title = "Loading...",
    description,
    size = "md",
    className = "",
}) => {
    // Size configurations
    const sizeConfig = {
        sm: {
            loaderWidth: "15px",
            loaderHeight: "60px",
            headWidth: "19px",
            headHeight: "45px",
            headLeft: "-17px",
            tailWidth: "5px",
            tailHeight: "10px",
            tailLeft: "-5px",
            tailBottom: "12px",
        },
        md: {
            loaderWidth: "20px",
            loaderHeight: "80px",
            headWidth: "25px",
            headHeight: "60px",
            headLeft: "-22px",
            tailWidth: "6px",
            tailHeight: "12px",
            tailLeft: "-6px",
            tailBottom: "15px",
        },
        lg: {
            loaderWidth: "26px",
            loaderHeight: "104px",
            headWidth: "33px",
            headHeight: "78px",
            headLeft: "-29px",
            tailWidth: "8px",
            tailHeight: "16px",
            tailLeft: "-8px",
            tailBottom: "20px",
        },
    };

    const config = sizeConfig[size];

    return (
        <div className={`text-center ${className}`}>
            <div className="bird-loader mx-auto mb-6"></div>
            {title && <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>}
            {description && <p className="text-gray-500">{description}</p>}

            <style>{`
        .bird-loader {
          width: ${config.loaderWidth};
          height: ${config.loaderHeight};
          background: #935936;
          position: relative;
        }
        .bird-loader:before {
          content: "";
          position: absolute;
          top: 10px;
          left: ${config.headLeft};
          width: ${config.headWidth};
          height: ${config.headHeight};
          background: 
            radial-gradient(farthest-side,#fff 92%,#0000) 60% 6px/4px 4px,
            radial-gradient(50% 60%,#0b6459 92%,#0000) center/70% 55%,
            radial-gradient(farthest-side,#0b6459 92%,#0000) 50% 3px/14px 14px,
            radial-gradient(142% 100% at bottom right,#0000 64%,#0b6459 65%) bottom/57% 40%,
            conic-gradient(from -120deg at right,#0b6459 36deg,#0000 0)100% 3px/51% 12px,
            conic-gradient(from 120deg at top left,#0000 ,#ef524a 2deg 40deg,#0000 43deg) top/100% 10px;
          background-repeat: no-repeat;    
          transform: rotate(-26deg);
          transform-origin: 100% 80%;
          animation: bird-wing-flap 0.25s infinite linear alternate;
        }
        .bird-loader:after {    
          content: "";
          position: absolute;
          width: ${config.tailWidth};
          height: ${config.tailHeight};
          left: ${config.tailLeft};
          bottom: ${config.tailBottom};
          border-radius: 100px 0 0 100px;
          background: #0b6459;
        }
        @keyframes bird-wing-flap {
          100% {transform: rotate(0)}
        }
      `}</style>
        </div>
    );
};

export default BirdLoading;
