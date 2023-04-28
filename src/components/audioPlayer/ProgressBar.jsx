import React from "react";
import { formatTime } from "../../utils/formatTime";

const ProgressBar = ({ currentTime, duration, progressBarClickToNavigate }) => {
  const progress = ((currentTime / duration) * 100).toFixed(1);
  
  return (
    <div className="mx-[33px]">
      <div
        // Dynamic values require inline styling
        style={{
          transform: `translateX(${progress}%)`,
        }}>
        <div
          id="progressBarHandle"
          className={`w-[9px] h-[9px] rounded-xl bg-black translate-y-[50px]`}></div>
      </div>
      <div
        className={`flex flex-col mt-[33px] `}
        onClick={progressBarClickToNavigate}>
        <div className="hover:cursor-pointer py-3 onClick={listenToClick}">
          <div className="bg-black h-[2px] w-full rounded-sm"></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-xs">{formatTime(currentTime)}</div>
          <div className="text-xs">{formatTime(duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
