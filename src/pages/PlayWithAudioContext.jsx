import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import ProgressBar from "../components/audioPlayer/ProgressBar";
import OptionHandleBar from "../components/OptionHandleBar";
import Controls from "../components/audioPlayer/Controls";

import image from "../assets/play-illustration-blueSkyMan.jpg";

import { PlayOptionContext } from "../context/playOptionContext";

import trackGenerator from "../utils/trackGenerator";

import { useStateWithCallback } from "../hooks/useStateWithCallback";

const Play = () => {
  const ctx = React.useContext(PlayOptionContext);
  const audioRef = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tracks, setTracks] = useStateWithCallback([]);
  const [currentTrackNumber, setCurrentTrackNumber] = React.useState(-1);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const audioTrack = audioContext.createMediaElementSource(audioRef.current);

  const progressBarClickToNavigate = (ev) => {
    const percentageOfClickedPosition =
      (ev.clientX - (window.innerWidth - ev.target.clientWidth) / 2) /
      ev.target.clientWidth;
    evenTrackAudio.current.currentTime = percentageOfClickedPosition * duration;
  };

  const handleControl = (ev) => {
    const buttonID = ev.currentTarget.id;
    // console.log("handle control for button:", buttonID);
    switch (buttonID) {
      case "10sBack":
        evenTrackAudio.current.currentTime -= 10;
        break;

      case "play":
        console.log("---PLAY button clicked");
        if (currentTrackNumber === -1) {
          // To play the first track change the state didOddTrackEnd
          setDidOddTrackEnd(true);
        } else {
          if (currentTrackNumber % 2 === 0) {
            evenTrackAudio.current.play();
          } else {
            oddTrackAudio.current.play();
          }
        }

        setIsPlaying(true);

        break;

      case "pause":
        if (currentTrackNumber % 2 === 0) {
          evenTrackAudio.current.pause();
        } else {
          oddTrackAudio.current.pause();
        }
        setIsPlaying(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className="app-container w-full h-full p-[32px] body-font font-poppins flex flex-col justify-between">
      <Header pathNameFirstPart="play"></Header>
      <div className="flex flex-col gap-5">
        {/* Playing Banner */}
        <div>
          <img
            className="w-full overflow-hidden object-cover aspect-square rounded-3xl border-8 border-white"
            src={image}
            alt="a man mediating with smiling face"
          />
        </div>
        {/* Option buttons */}
        <OptionHandleBar />
        {/* Progress bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          progressBarClickToNavigate={progressBarClickToNavigate}
        />
        {/* Control buttons */}
        <Controls isPlaying={isPlaying} handleControl={handleControl} />
        {/* Audio player */}
        <audio ref={audioTrack}></audio>

      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
