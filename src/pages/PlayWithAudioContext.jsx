import React, { useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import ProgressBar from "../components/audioPlayer/ProgressBar";
import OptionHandleBar from "../components/OptionHandleBar";
import Controls from "../components/audioPlayer/Controls";

import image from "../assets/play-illustration-blueSkyMan.jpg";

import { PlayOptionContext } from "../context/playOptionContext";

const Play = () => {
  const ctx = React.useContext(PlayOptionContext);

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

  let startingTime;
  const [totalDurationOfSourceNodes, setTotalDurationOfSourceNodes] =
    React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFirstPlaying, setIsFirstPlaying] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState("00:00");

  const [audioNodes, setAudioNodes] = React.useState([]);
  const [audioBuffers, setAudioBuffers] = React.useState([]);
  const [currentTrackNumber, setCurrentTrackNumber] = React.useState(0);
  const [pausedAt, setPausedAt] = React.useState(0);
  const [pausedBuffer, setPausedBuffer] = React.useState(null);
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

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // utility function to fetch and decode an audio file
  async function loadAudioFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  // function to play a sequence of AudioBuffers
  function connectNodesToDestination(audioBuffers) {
    let sum = 0;
    let nodes = audioBuffers.map((audioBuffer) => {
      let node = audioContext.createBufferSource();
      node.buffer = audioBuffer;
      sum += audioBuffer.duration;
      node.connect(audioContext.destination);
      return node;
    });
    setAudioNodes(nodes);
    setTotalDurationOfSourceNodes(sum);
  }

  // Add onEnded event listener to each source node
  useEffect(() => {
    audioNodes.forEach((node, index) => {
      if (index < audioNodes.length - 1) {
        node.onended = () => {
          console.log("Track #", index, "ended");
          audioNodes[index + 1].start(0);
          setCurrentTrackNumber(index + 1);
        };
      } else {
        node.onended = () => {
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
      console.log("PAUSE at track #", currentTrackNumber);
      // Remove the onended event listener and stop the current source node
      audioNodes[currentTrackNumber].onended = null;
      audioNodes[currentTrackNumber].stop();
      // Increment the pausedAt by the current time
      console.log("audioContext.currentTime", audioContext.currentTime);
      setPausedAt((prev) => prev + audioContext.currentTime);
      timerForPausedState(true);
    } else {
      console.log("PLAY the track #", currentTrackNumber);
      startAudioPlayback();
    }
    setIsPlaying(!isPlaying);
  }

  const [pausedDuration, setPausedDuration] = React.useState(0);
  let pausedTimerRef = React.useRef(null);
  function timerForPausedState(start) {
    if (start) {
      pausedTimerRef.current = setInterval(() => {
        setPausedDuration((prev) => prev + 0.001);
      }, 1);
    } else {
      console.log("clearInterval");
      clearInterval(pausedTimerRef.current);
      pausedTimerRef.current = null;
    }
  }

  // useEffect(() => {
  //   console.log("pausedDuration", pausedDuration);
  // }, [pausedDuration]);

  // Reset the pausedAt when the track changes
  useEffect(() => {
    setPausedAt(0);
  }, [currentTrackNumber]);

  function startAudioPlayback() {
    if (isFirstPlaying) {
      startingTime = Date.now();
      audioNodes[0].start();
      setIsFirstPlaying(false);
    } else {
      console.log("pausedDuration", pausedDuration);
      // For resuming, create a new source node, connect it to the destination,
      // and add an onended event listener
      timerForPausedState(false);
      const pausedNode = audioContext.createBufferSource();
      pausedNode.buffer = audioBuffers[currentTrackNumber];
      pausedNode.connect(audioContext.destination);
      pausedNode.onended = () => {
        console.log("track #", currentTrackNumber, "ended");
        audioNodes[currentTrackNumber + 1].start(audioContext.currentTime);
        setCurrentTrackNumber(currentTrackNumber + 1);
      };
      // Start the paused node at the pausedAt position
      console.log("start from pausedAt", pausedAt);
      console.log(pausedNode);
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
    evenTrackAudio.current.currentTime = percentageOfClickedPosition * ctx.playOption.duration;
  };

  useEffect(() => {
    console.log(audioContext.currentTime);
  }, [audioContext.currentTime]);

  const [elapsedTime, setElapsedTime] = React.useState(0);
  const requestId = React.useRef();

  useEffect(() => {
    const updateElapsedTime = () => {
      if (isPlaying) {
        setElapsedTime(audioContext.currentTime - pausedDuration);
      }
      requestId.current = requestAnimationFrame(updateElapsedTime);
    };

    // start the loop
    requestId.current = requestAnimationFrame(updateElapsedTime);

    return () => {
      cancelAnimationFrame(requestId.current);
    };
  }, [isPlaying, pausedDuration]);

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
          currentTime={elapsedTime}
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
