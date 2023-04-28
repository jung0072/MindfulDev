import React from "react";
import OptionButton from "./OptionButton";

import { PlayOptionContext } from "../context/playOptionContext";

const OptionHandleBar = () => {
  const ctx = React.useContext(PlayOptionContext);
  const [isSelectMode, setIsSelectMode] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState("");
  const [buttonTexts, setButtonTexts] = React.useState([]);

  const handleOptionSelection = (ev) => {
    // Change playOption state
    const type = ev.target.id.split("/")[0];
    const value = ev.target.id.split("/")[1];
    if (type === "duration") {
      ctx.setPlayOptionContext({ ...ctx.playOption, duration: value });
    } else if (type === "difficulty") {
      ctx.setPlayOptionContext({ ...ctx.playOption, level: value });
    } else if (type === "bgMusic") {
      ctx.setPlayOptionContext({ ...ctx.playOption, bgMusic: value });
    }
    // Switch option buttons to displaying state
    setIsSelectMode(false);
  };

  const showOptionSelection = (ev) => {
    // Change option buttons' texts
    const type = ev.target.id.split("/")[0];
    if (type === "duration") {
      setButtonTexts(["5mins", "10mins", "15mins"]);
      setSelectedType("duration");
    } else if (type === "difficulty") {
      setButtonTexts(["Beginner", "Intermediate", "Advanced"]);
      setSelectedType("difficulty");
    } else if (type === "bgMusic") {
      setButtonTexts(["Rain", "Forest", "Ocean"]);
      setSelectedType("bgMusic");
    }
    // Switch displaying state to option buttons
    setIsSelectMode(true);
  };

  return (
    <div className="mx-[33px] mt-[45px]">
      {isSelectMode ? (
        <div className="flex justify-between">
          <OptionButton
            type={selectedType}
            text={buttonTexts[0]}
            hoverSlide="true"
            onClick={handleOptionSelection}
          />
          <OptionButton
            type={selectedType}
            text={buttonTexts[1]}
            hoverSlide="true"
            onClick={handleOptionSelection}
          />
          <OptionButton
            type={selectedType}
            text={buttonTexts[2]}
            hoverSlide="true"
            onClick={handleOptionSelection}
          />
        </div>
      ) : (
        <div className="flex justify-between">
          <OptionButton
            type="duration"
            text={ctx.playOption.duration}
            hoverSlide="true"
            onClick={showOptionSelection}
          />
          <OptionButton
            type="difficulty"
            text={ctx.playOption.level}
            hoverSlide="true"
            onClick={showOptionSelection}
          />
          <OptionButton
            type="bgMusic"
            text={ctx.playOption.bgMusic}
            hoverSlide="true"
            onClick={showOptionSelection}
          />
        </div>
      )}
    </div>
  );
};

export default OptionHandleBar;
