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
  const evenTrackAudio = React.useRef();
  const oddTrackAudio = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tracks, setTracks] = useStateWithCallback([]);
  const [currentTrackNumber, setCurrentTrackNumber] = React.useState(-1);
  const [currentTime, setCurrentTime] = React.useState("00:00");
  const [duration, setDuration] = React.useState("00:00");
  const [isEvenTrackLoaded, setIsEvenTrackLoaded] = React.useState(false);
  const [isOddTrackLoaded, setIsOddTrackLoaded] = React.useState(false);
  const [didEvenTrackEnd, setDidEvenTrackEnd] = React.useState(false);
  const [didOddTrackEnd, setDidOddTrackEnd] = React.useState(false);

  console.log("--Play.jsx-----", currentTrackNumber);

  // Add event listener to the audio elements
  React.useEffect(() => {
    trackAddEventListener();
  }, []);

  // Play next track depending on whether current track is loaded and prev track is ended
  // Use this hook only for playing next track automatically
  // Don't use this hook for pause/play
  React.useEffect(() => {
    console.log(
      "Loaded/Ended States Got Changed \n",
      "isEvenTrackLoaded/didOddTrackEnd:",
      isEvenTrackLoaded,
      didOddTrackEnd,
      "isOddTrackLoaded/didEvenTrackEnd:",
      isOddTrackLoaded,
      didEvenTrackEnd
    );

    // When the last track ended
    if (
      currentTrackNumber >= tracks.length &&
      (didOddTrackEnd || didEvenTrackEnd)
    ) {
      // Reset the states
      setIsEvenTrackLoaded(false);
      setIsOddTrackLoaded(false);
      setDidEvenTrackEnd(false);
      setDidOddTrackEnd(false);
      setCurrentTrackNumber(0);
      setIsPlaying(false);
      evenTrackAudio.current.src = tracks[0];
    }

    if (isPlaying) {
      // Play the even track if it is loaded and odd track ended
      if (isEvenTrackLoaded && didOddTrackEnd) {
        setCurrentTrackNumber((currentTrackNumber) => currentTrackNumber + 1);
        // Reset the states
        setIsEvenTrackLoaded(false);
        setDidOddTrackEnd(false);
        evenTrackAudio.current.play();
        // Start loading the next track
        if (currentTrackNumber < tracks.length - 1) {
          oddTrackAudio.current.src = tracks[currentTrackNumber + 2];
        }
      }
      // Play the odd track if it is loaded and even track ended
      else if (isOddTrackLoaded && didEvenTrackEnd) {
        setCurrentTrackNumber((currentTrackNumber) => currentTrackNumber + 1);
        // Reset the states
        setIsOddTrackLoaded(false);
        setDidEvenTrackEnd(false);
        oddTrackAudio.current.play();
        // Start loading the next track
        if (currentTrackNumber < tracks.length - 1) {
          evenTrackAudio.current.src = tracks[currentTrackNumber + 2];
        }
      }
    }
  }, [isEvenTrackLoaded, isOddTrackLoaded, didEvenTrackEnd, didOddTrackEnd]);

  // Generate tracks when ctx.playOption changes
  React.useEffect(() => {
    console.log("Play UseEffect / ctx:", ctx.playOption);

    const generatedTracks = trackGenerator(ctx.playOption);
    setTracks(generatedTracks, (_prevTracks, newTracks) => {
      console.log("Loaded Track number:", newTracks.length);
      if (isPlaying) {
        // When the audio is playing, load the next track
        // Currently playing track number is "currentTrackNumber"
        if (currentTrackNumber % 2 === 0) {
          oddTrackAudio.current.src = newTracks[currentTrackNumber + 1];
        } else {
          evenTrackAudio.current.src = newTracks[currentTrackNumber + 1];
        }
      } else {
        // Load the first two tracks when the audio is not playing
        oddTrackAudio.current.src = newTracks[1];
        evenTrackAudio.current.src = newTracks[0];
      }
    });
  }, [ctx]);

  // React.useEffect(() => {
  //   console.log("Play useEffect / currentTrackNumber:", currentTrackNumber);
  //   // evenTrackAudio.current.addEventListener("timeupdate", () => {
  //   //   setCurrentTime(evenTrackAudio.current.currentTime);
  //   // });
  // }, [currentTrackNumber, tracks]);

  const trackAddEventListener = () => {
    // EVEN TRACK Event Listener
    evenTrackAudio.current.addEventListener("loadedmetadata", () => {
      console.log("even track loaded");
      setIsEvenTrackLoaded(true);
    });
    evenTrackAudio.current.addEventListener("ended", () => {
      console.log("even track ended");
      setDidEvenTrackEnd(true);
      setDidOddTrackEnd(false);
    });

    // ODD TRACK Event Listener
    oddTrackAudio.current.addEventListener("loadedmetadata", () => {
      console.log("odd track loaded");
      setIsOddTrackLoaded(true);
    });
    oddTrackAudio.current.addEventListener("ended", () => {
      console.log("odd track ended");
      setDidOddTrackEnd(true);
      setDidEvenTrackEnd(false);
    });
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
        console.log("---PLAY button clicked");
        if (currentTrackNumber === -1) {
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
        <audio ref={evenTrackAudio}></audio>
        <audio ref={oddTrackAudio}></audio>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
