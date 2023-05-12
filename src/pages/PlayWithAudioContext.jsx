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
  const [duration, setDuration] = React.useState("10mins");

  useEffect(() => {
    setDuration(ctx.playOption.duration);
    console.log("duration changed", ctx.playOption.duration);
  }, [ctx.playOption.duration]);

  let startingTime;
  const [totalDurationOfSourceNodes, setTotalDurationOfSourceNodes] =
    React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFirstPlaying, setIsFirstPlaying] = React.useState(true);
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
            ((Date.now() - startingTime) / 1000 - totalDurationOfSourceNodes) /
              (audioNodes.length - 1),
            "seconds"
          );
          setCurrentTrackNumber(0);
          setIsPlaying(false);
        };
      }
    });
  }, [audioNodes]);

  useEffect(() => {
    // load all audio files, then play them in sequence
    const filesToLoad =
      duration === "10mins"
        ? audioFiles
        : audioFiles.filter((_, i) => i % 2 === 0);
    Promise.all(filesToLoad.map(loadAudioFile))
      .then((audioBuffers) => {
        setAudioBuffers(audioBuffers);
        connectNodesToDestination(audioBuffers);
      })
      .catch(console.error);
  }, [duration]);

  function handleControl() {
    if (isPlaying) {
      console.log("PAUSE at track #", currentTrackNumber);
      // Remove the onended event listener and stop the current source node
      audioNodes[currentTrackNumber].onended = null;
      audioNodes[currentTrackNumber].stop();
      // Increment the pausedAt by the current time
      setPausedAt((prev) => prev + audioContext.currentTime);
    } else {
      console.log("PLAY the track #", currentTrackNumber);
      startAudioPlayback();
    }
    setIsPlaying(!isPlaying);
  }

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
      // For resuming, create a new source node, connect it to the destination,
      // and add an onended event listener
      const pausedNode = audioContext.createBufferSource();
      pausedNode.buffer = audioBuffers[currentTrackNumber];
      pausedNode.connect(audioContext.destination);
      pausedNode.onended = () => {
        console.log("track #", currentTrackNumber, "ended");
        audioNodes[currentTrackNumber + 1].start(audioContext.currentTime);
        setCurrentTrackNumber(currentTrackNumber + 1);
      };
      // Start the paused node at the pausedAt position
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
        {/* <ProgressBar
          currentTime={currentTime}
          duration={duration}
          progressBarClickToNavigate={progressBarClickToNavigate}
        /> */}
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
