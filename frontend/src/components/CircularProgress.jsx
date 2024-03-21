/* eslint-disable react/prop-types */

const CircularProgress = ({ overallProgress }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[65%]">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <circle
            className="text-gray-300 stroke-current"
            cx="18"
            cy="18"
            r="16"
            strokeWidth="3"
            fill="none"
          />
          <circle
            className="text-blue-500 stroke-current"
            cx="18"
            cy="18"
            r="16"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${overallProgress}, 100`}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-center text-[#0098EF]">
            <span className="text-lg font-medium text-white">Progress</span>
            <br />
            {overallProgress || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
