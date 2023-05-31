import React, { useEffect, useRef } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import ProgressBar from "../components/audioPlayer/ProgressBar";
import OptionHandleBar from "../components/OptionHandleBar";
import Controls from "../components/audioPlayer/Controls";

import image from "../assets/play-illustration-blueSkyMan.jpg";

import { PlayOptionContext } from "../context/playOptionContext";

const Play = () => {
  const ctx = React.useContext(PlayOptionContext);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFirstPlaying, setIsFirstPlaying] = React.useState(true);
  const [audioNodes, setAudioNodes] = React.useState([]);
  const [audioBuffers, setAudioBuffers] = React.useState([]);
  const [totalDurationOfSourceNodes, setTotalDurationOfSourceNodes] =
    React.useState(0);
  const [currentTrackNumber, setCurrentTrackNumber] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const audioContext = React.useRef(
    new (window.AudioContext || window.webkitAudioContext)({
      bufferSize: 16384,
    })
  );
  const audioFiles = [
    "src/assets/one.wav",
    "src/assets/two.wav",
    "src/assets/three.wav",
    "src/assets/four.wav",
    "src/assets/five.wav",
    "src/assets/six.wav",
    "src/assets/seven.wav",
    "src/assets/eight.wav",
    "src/assets/nine.wav",
    "src/assets/ten.wav",
  ];
  // const audioFiles = ["src/assets/mixdown.wav"];

  // Load audio files based on the ctx duration option
  useEffect(() => {
    console.log("duration changed", ctx.playOption.duration);
    const filesToLoad =
      ctx.playOption.duration === "10mins"
        ? audioFiles
        : audioFiles.filter((_, i) => i % 2 === 0);
    Promise.all(filesToLoad.map(loadAudioFile))
      .then((audioBuffers) => {
        setAudioBuffers(audioBuffers);
        connectNodesToDestination(audioBuffers);
      })
      .catch(console.error);
  }, [ctx.playOption.duration]);

  // function to fetch and decode an audio file
  async function loadAudioFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  // function to play a sequence of AudioBuffers
  function connectNodesToDestination(audioBuffers) {
    let sum = 0;
    let nodes = audioBuffers.map((audioBuffer) => {
      let node = audioContext.current.createBufferSource();
      node.buffer = audioBuffer;
      sum += audioBuffer.duration;
      node.connect(audioContext.current.destination);
      return node;
    });
    setAudioNodes(nodes);
    setTotalDurationOfSourceNodes(sum);
  }

  // Add an onEnded event listener to each source node
  const totalDurationOfEndedNodes = useRef(0);
  useEffect(() => {
    audioNodes.forEach((node, index) => {
      if (index < audioNodes.length - 1) {
        node.onended = async () => {
          console.log("Track #", index, "ended");
          audioNodes[index + 1].start(0);
          setCurrentTrackNumber(index + 1);
          totalDurationOfEndedNodes.current += node.buffer.duration;
        };
      } else {
        // Last track
        node.onended = () => {
          clearInterval(interval.current);
          console.log("Last Track ended");
          console.log(
            "Average delay per track:",
            parseFloat(
              ((Date.now() - startingTime) / 1000 -
                totalDurationOfSourceNodes) /
                (audioNodes.length - 1)
            ).toFixed(5),
            "seconds"
          );
          setCurrentTrackNumber(0);
          setIsPlaying(false);
          totalDurationOfEndedNodes.current = 0;
          // Reload all audio files for the next play
          const filesToLoad =
            ctx.playOption.duration === "10mins"
              ? audioFiles
              : audioFiles.filter((_, i) => i % 2 === 0);
          Promise.all(filesToLoad.map(loadAudioFile))
            .then((audioBuffers) => {
              setAudioBuffers(audioBuffers);
              connectNodesToDestination(audioBuffers);
            })
            .catch(console.error);
        };
      }
    });
  }, [audioNodes]);

  function handleControl() {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
    setIsPlaying(!isPlaying);
  }

  function startAudioPlayback() {
    if (isFirstPlaying) {
      audioNodes[0].start();
      setIsFirstPlaying(false);
    } else {
      console.log("--- PLAY the track #", currentTrackNumber);
      console.log("audioContext currentTime", audioContext.current.currentTime);
      // For resuming, create a new source node, connect it to the destination,
      // and add an onended event listener
      const pausedNode = audioContext.current.createBufferSource();
      pausedNode.buffer = audioBuffers[currentTrackNumber];
      pausedNode.connect(audioContext.current.destination);
      pausedNode.onended = () => {
        console.log("track #", currentTrackNumber, "ended");
        audioNodes[currentTrackNumber + 1].start(0);
        setCurrentTrackNumber(currentTrackNumber + 1);
        totalDurationOfEndedNodes.current += pausedNode.buffer.duration;
      };
      // Start the paused node at the pausedAt position

      console.log(
        "audioContext",
        audioContext.current.currentTime,
        "\npausedDuration",
        pausedDuration.current,
        "\ntotalDurationOfEndedNodes",
        totalDurationOfEndedNodes.current
      );
      // pauseAt is for the timestamp where the CURRENT track is paused
      const pausedAt =
        audioContext.current.currentTime -
        pausedDuration.current -
        totalDurationOfEndedNodes.current;
      console.log("pausedAt", pausedAt);
      pausedNode.start(0, pausedAt);
      // Update the old source node with the new source node
      setAudioNodes((prev) => {
        return prev.map((node, index) => {
          if (index === currentTrackNumber) {
            return pausedNode;
          } else {
            return node;
          }
        });
      });
    }
  }

  const progressBarClickToNavigate = (ev) => {
    const percentageOfClickedPosition =
      (ev.clientX - (window.innerWidth - ev.target.clientWidth) / 2) /
      ev.target.clientWidth;
    evenTrackAudio.current.currentTime =
      percentageOfClickedPosition * ctx.playOption.duration;
  };

  // For controlling the audio playback, we will use only one variable: pausedDuration
  // pausedDuration = DateTime.now() - DateTimeAtPaused
  // currentTimeOfEntireTrack = audioContext.currentTime - pausedDuration
  // currentTimeOfCurrentTrack = currentTimeOfEntireTrack - totalDurationOfEndedNodes

  const interval = useRef();
  const DateTimeAtPaused = useRef(0);
  const pause = () => {
    console.log("PAUSE");
    audioNodes[currentTrackNumber].onended = null;
    audioNodes[currentTrackNumber].stop();
    DateTimeAtPaused.current = Date.now();
    clearInterval(interval.current);
  };

  const pausedDuration = useRef(0);
  const resume = () => {
    if (DateTimeAtPaused.current != 0) {
      pausedDuration.current += (Date.now() - DateTimeAtPaused.current) / 1000;
    }
    startAudioPlayback();
    startDisplayingCurrentTime();
    DateTimeAtPaused.current = 0;
  };

  const startDisplayingCurrentTime = () => {
    interval.current = setInterval(() => {
      setCurrentTime(audioContext.current.currentTime - pausedDuration.current);
    }, 100);
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
          duration={totalDurationOfSourceNodes}
          progressBarClickToNavigate={progressBarClickToNavigate}
        />
        {/* Control buttons */}
        <Controls isPlaying={isPlaying} handleControl={handleControl} />
        {/* Audio player */}
        {/* <audio ref={audioTrack}></audio> */}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
