import type { StepCardProps } from "../../../types";

const StepCard: React.FC<StepCardProps> = ({ step, title, description }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center mb-4">
      <div className="h-px w-12 bg-gray-300"></div>
      <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
        Step {step} of 3
      </span>
      <div className="h-px w-12 bg-gray-300"></div>
    </div>
    <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600 text-lg">{description}</p>
  </div>
);

export default StepCard;