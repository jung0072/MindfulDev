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
  // console.log("------Play.jsx-----");
  const ctx = React.useContext(PlayOptionContext);
  const audioPlayer = React.useRef();
  const audioPlayer2 = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tracks, setTracks] = useStateWithCallback([]);
  const [currentTrack, setCurrentTrack] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");

  // When option context is changed
  React.useEffect(() => {
    console.log("Play UseEffect / ctx:", ctx.playOption);
    // Pause the audio if it is loaded already
    if (audioPlayer.current.src) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    }
    const generatedTracks = trackGenerator(ctx.playOption);
    // console.log("generatedTracks", generatedTracks);
    setTracks(generatedTracks, (_prevTracks, newTracks) => {
      console.log("Loaded Track number:", newTracks.length);
      audioPlayer.current = new Audio(newTracks[currentTrack]);
    });
  }, [ctx]);

  React.useEffect(() => {
    console.log("Play useEffect / currentTrack:", currentTrack);

    if (currentTrack % 2 == 0) {
      audioPlayer2.current = new Audio(tracks[currentTrack + 1]);
      audioPlayer.current.addEventListener("loadedmetadata", onLoadedMetadata);
      audioPlayer.current.addEventListener("ended", () => {
        console.log("EVEN order audio ended");
        if (currentTrack !== tracks.length - 1) {
          console.log("READYSTATE",audioPlayer2.readyState);
          audioPlayer2.current.play();
        }
        setCurrentTrack((currentTrack) => currentTrack + 1);
      });
    } else {
      audioPlayer.current = new Audio(tracks[currentTrack + 1]);
      audioPlayer2.current.addEventListener("loadedmetadata", onLoadedMetadata);
      audioPlayer2.current.addEventListener("ended", () => {
        console.log("ODD order audio ended");
        if (currentTrack !== tracks.length - 1) {
          audioPlayer.current.play();
        }
        setCurrentTrack((currentTrack) => currentTrack + 1);
      });
    }

    // audioPlayer.current.addEventListener("timeupdate", () => {
    //   setCurrentTime(audioPlayer.current.currentTime);
    // });
  }, [currentTrack, tracks]);

  const onLoadedMetadata = () => {
    console.log("onLoadedMetadata");
    if (currentTrack == tracks.length - 1) {
      // When you reach to the end of the track list, reset the current track to 0
      setIsPlaying(false);
      setCurrentTrack(0);
    } else if (currentTrack !== 0 && currentTrack !== tracks.length - 1) {
      // When you are in the middle of the track list, play the next track
      if (currentTrack % 2 == 0) {
        console.log("even order audio play");
        audioPlayer.current.play();
      } else {
        console.log("odd order audio play");
        audioPlayer2.current.play();
      }
    }
    // setDuration(audioPlayer.current.duration);
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
        <audio ref={audioPlayer2}></audio>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
