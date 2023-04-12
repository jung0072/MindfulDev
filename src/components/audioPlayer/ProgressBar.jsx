import React from "react";
import { formatTime } from "../../utils/formatTime";

const ProgressBar = ({ currentTime, duration }) => {
  // const progress = 20.1;
  const progress = Math.floor((currentTime / duration) * 100);
  return (
    <div className="mx-[33px]">
      {/* ProgressBarHandle is not moving */}
      <div className={`pl-[${progress}%]`}>
        <div
          id="progressBarHandle"
          className={`w-[9px] h-[9px] rounded-xl bg-black translate-y-[50px]`}
        ></div>
      </div>
      <div className={`flex flex-col mt-[45px] `}>
        <div className="bg-black h-[2px] w-full rounded-sm"></div>
        <div className="flex justify-between mt-2">
          <div className="text-xs">{formatTime(currentTime)}</div>
          <div className="text-xs">{formatTime(duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
