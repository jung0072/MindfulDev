import { useState } from "react";

// onClick must be function that runs without parameters

const OptionButton = ({ type, text, color, size, onClick }) => {
  let widthAndHeight = "w-3/12 h-[26px]";
  switch (size) {
    case "small":
      widthAndHeight = "w-2/12 h-[20.8px]";
      break;
    case "medium":
      widthAndHeight = "w-3/12 h-[26px]";
      break;
    case "large":
      widthAndHeight = "w-4/12 h-[31.2px]";
      break;
    default:
      // default is medium
      widthAndHeight = "w-3/12 h-[26px]";
      break;
  }

  return (
    <button
      id={type + '/' + text}
      className={`btn-elevated flex items-center justify-center rounded-[6.25rem] shadow-lg text-xs bg-${
        color ? color : "primary-20"
      } ${widthAndHeight} hover:cursor-pointer hover:bg-[#166534] hover:text-white`}
      onClick={onClick}>
      {text}
    </button>
  );
};

export default OptionButton;
