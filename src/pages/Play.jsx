import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import ProgressBar from "../components/audioPlayer/ProgressBar";
import OptionHandleBar from "../components/OptionHandleBar";
import Controls from "../components/audioPlayer/Controls";

import image from "../assets/play-illustration-blueSkyMan.jpg";

import { PlayOptionContext } from "../context/playOptionContext";

import trackGenerator from "../utils/trackGenerator";

const Play = () => {
  // console.log("------Play.jsx-----");
  const ctx = React.useContext(PlayOptionContext);
  const audioPlayer = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tracks, setTracks] = React.useState([]);
  const [currentTrack, setCurrentTrack] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");

  React.useEffect(() => {
    console.log("Play UseEffect(ctx)", ctx.playOption);
    audioPlayer.current.pause();
    setIsPlaying(false);
    const generatedTracks = trackGenerator(ctx.playOption);
    console.log("generatedTracks", generatedTracks);
    setTracks(generatedTracks);
  }, [ctx]);

  React.useEffect(() => {
    console.log(
      "Play useEffect(currentTrack and tracks)",
      currentTrack,
      tracks
    );
    audioPlayer.current = new Audio(tracks[currentTrack]);
    // audioPlayer.current.addEventListener("loadedmetadata", onLoadedMetadata);
    // audioPlayer.current.addEventListener("timeupdate", () => {
    //   setCurrentTime(audioPlayer.current.currentTime);
    // });

    audioPlayer.current.addEventListener("ended", () => {
      console.log("audio ended");
      audioPlayer.current = new Audio(tracks[currentTrack + 1]);
      setCurrentTrack((currentTrack) => currentTrack + 1);
    });

    if (currentTrack == tracks.length - 1) {
      // When you reach to the end of the track list, reset the current track to 0
      setIsPlaying(false);
      setCurrentTrack(0);
    } else if (currentTrack !== 0 && currentTrack !== tracks.length - 1) {
      // When you are in the middle of the track list, play the next track
      audioPlayer.current.play();
    }
  }, [currentTrack, tracks]);

  const onLoadedMetadata = () => {
    console.log("onLoadedMetadata");
    setDuration(audioPlayer.current.duration);
  };

  const progressBarClickToNavigate = (ev) => {
    const percentageOfClickedPosition =
      (ev.clientX - (window.innerWidth - ev.target.clientWidth) / 2) /
      ev.target.clientWidth;
    audioPlayer.current.currentTime = percentageOfClickedPosition * duration;
  };

  const handleControl = (ev) => {
    const buttonID = ev.currentTarget.id;
    // console.log("handle control for button:", buttonID);
    switch (buttonID) {
      case "10sBack":
        audioPlayer.current.currentTime -= 10;
        break;

      case "play":
        audioPlayer.current.play();
        setIsPlaying(true);
        break;

      case "pause":
        audioPlayer.current.pause();
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
        <audio ref={audioPlayer}></audio>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
