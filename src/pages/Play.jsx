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
  console.log("------Play.jsx-----");
  const ctx = React.useContext(PlayOptionContext);
  const evenTrackAudio = React.useRef();
  const oddTrackAudio = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tracks, setTracks] = useStateWithCallback([]);
  const [currentTrack, setCurrentTrack] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");
  // const [isEvenTrackLoaded, setIsEvenTrackLoaded] = React.useState(false);
  // const [isOddTrackLoaded, setIsOddTrackLoaded] = React.useState(false);
  const isEvenTrackLoaded = React.useRef(false);
  const isOddTrackLoaded = React.useRef(false);
  // console.log("isEvenTrackLoaded", isEvenTrackLoaded);
  // console.log("isOddTrackLoaded", isOddTrackLoaded);
  let stopWhileLoop = 0;

  // When option context changes
  React.useEffect(() => {
    console.log("Play UseEffect / ctx:", ctx.playOption);
    // Pause the audio if it is loaded already
    if (evenTrackAudio.current.src) {
      evenTrackAudio.current.pause();
      setIsPlaying(false);
    }

    // EVEN TRACK Event Listener
    evenTrackAudio.current.addEventListener("loadedmetadata", () => {
      console.log("even track loaded");
      isEvenTrackLoaded.current = true;
    });
    evenTrackAudio.current.addEventListener("ended", () => {
      console.log("isOddTrackLoaded", isOddTrackLoaded.current);
      console.log("EVEN order audio ended");
      evenTrackAudio.current.pause();

      isEvenTrackLoaded.current = false;
      evenTrackAudio.current.src = tracks[currentTrack + 1];
      evenTrackAudio.current.addEventListener("loadedmetadata", () => {
        console.log("even track loaded");
        isEvenTrackLoaded.current = true;
      });
      evenTrackAudio.current.load();

      while (!isOddTrackLoaded.current) {
        if (stopWhileLoop > 1000) {
          stopWhileLoop = 0;
          break;
        }
        stopWhileLoop++;
        console.log("waiting for odd track to be loaded");
      }
      if (isOddTrackLoaded) {
        setCurrentTrack((currentTrack) => currentTrack + 1);
        oddTrackAudio.current.play();
      }
    });

    // ODD TRACK Event Listener
    oddTrackAudio.current.addEventListener("loadedmetadata", () => {
      console.log("odd track loaded");
      isOddTrackLoaded.current = true;
    });
    oddTrackAudio.current.addEventListener("ended", () => {
      console.log("isEvenTrackLoaded", isEvenTrackLoaded.current);
      console.log("ODD order audio ended");
      evenTrackAudio.current.pause();

      isOddTrackLoaded.current = false;
      oddTrackAudio.current.src = tracks[currentTrack + 1];

      oddTrackAudio.current.addEventListener("loadedmetadata", () => {
        console.log("odd track loaded");
        isOddTrackLoaded.current = true;
      });

      while (!isEvenTrackLoaded.current) {
        if (stopWhileLoop > 1000) {
          stopWhileLoop = 0;
          break;
        }
        stopWhileLoop++;
        console.log("waiting for odd track to be loaded");
      }
      if (isEvenTrackLoaded) {
        setCurrentTrack((currentTrack) => currentTrack + 1);
        evenTrackAudio.current.play();
      }
    });

    const generatedTracks = trackGenerator(ctx.playOption);
    // console.log("generatedTracks", generatedTracks);
    setTracks(generatedTracks, (_prevTracks, newTracks) => {
      console.log("Loaded Track number:", newTracks.length);
      evenTrackAudio.current.src = newTracks[currentTrack];
      oddTrackAudio.current.src = newTracks[currentTrack + 1];
    });
  }, [ctx]);

  // React.useEffect(() => {
  //   console.log("Play useEffect / currentTrack:", currentTrack);
  //   // evenTrackAudio.current.addEventListener("timeupdate", () => {
  //   //   setCurrentTime(evenTrackAudio.current.currentTime);
  //   // });
  // }, [currentTrack, tracks]);

  const onLoadedMetadata = () => {
    console.log("onLoadedMetadata");
    // setDuration(evenTrackAudio.current.duration);
  };

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
        evenTrackAudio.current.play();
        setIsPlaying(true);
        break;

      case "pause":
        evenTrackAudio.current.pause();
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
        <audio ref={evenTrackAudio}></audio>
        <audio ref={oddTrackAudio}></audio>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
