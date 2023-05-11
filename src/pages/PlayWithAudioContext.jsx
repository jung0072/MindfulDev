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

  const [isPlaying, setIsPlaying] = React.useState(false);
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

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // utility function to fetch and decode an audio file
  async function loadAudioFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  // function to play a sequence of AudioBuffers
  function playAudioBuffersInSequence(audioBuffers) {
    let time = audioContext.currentTime;
    for (let audioBuffer of audioBuffers) {
      let source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(time);
      time += audioBuffer.duration;
    }
  }

  useEffect(() => {
    // load all audio files, then play them in sequence
    const filesToLoad =
      duration === "10mins"
        ? audioFiles
        : audioFiles.filter((_, i) => i % 2 === 0);
    Promise.all(filesToLoad.map(loadAudioFile))
      .then((audioBuffers) => playAudioBuffersInSequence(audioBuffers))
      .catch(console.error);
  }, [duration]);

  function handleControl() {
    console.log("handleControl");
    if (isPlaying) {
      audioContext.pause().then(() => {
        console.log("Playback paused successfully");
        setIsPlaying(!isPlaying);
      });
    } else {
      audioContext.resume().then(() => {
        console.log("Playback resumed successfully");
        setIsPlaying(!isPlaying);
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
