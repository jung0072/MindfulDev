import React, { useEffect, useRef } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import OptionHandleBar from "../components/OptionHandleBar";
import Controls from "../components/audioPlayer/Controls";

import image from "../assets/play-illustration-blueSkyMan.jpg";

import { PlayOptionContext } from "../context/playOptionContext";

import trackGenerator from "../utils/trackGenerator";

const Play = () => {
  const ctx = React.useContext(PlayOptionContext);
  const ctxRef = useRef(ctx);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFirstPlaying, setIsFirstPlaying] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [staleTrackEnded, setStaleTrackEnded] = React.useState(false);
  const [audioNodes, setAudioNodes] = React.useState([]);
  const [audioBuffers, setAudioBuffers] = React.useState([]);
  const [totalDurationOfSourceNodes, setTotalDurationOfSourceNodes] =
    React.useState(0);
  const totalDurationOfEndedNodes = useRef(0);
  const [currentTrackNumber, setCurrentTrackNumber] = React.useState(0);
  const DateTimeAtPaused = useRef(0);
  const pausedDuration = useRef(0);
  const audioContext = React.useRef(
    new (window.AudioContext || window.webkitAudioContext)({
      bufferSize: 512,
    })
  );

  // Load audio files based on the ctx duration option
  useEffect(() => {
    console.log("duration changed", ctx.playOption.duration);
    audioNodes.forEach((node, index) => {
      if (index > currentTrackNumber) {
        node.disconnect();
      } else if (index === currentTrackNumber) {
        node.onended = async () => {
          setStaleTrackEnded(true);
        };
      }
    });
    updateLoadAndConnectTracks(ctx.playOption);
    // update reference to ctx for EventListener to use
    ctxRef.current = ctx;
  }, [ctx.playOption.duration]);

  useEffect (() => {
    // console.log("staleTrackEnded changed", staleTrackEnded);
    if (staleTrackEnded) {
      // console.log("staleTrackEnded is true");
      if (currentTrackNumber < audioNodes.length - 1) {
        // console.log("start next track", audioNodes[currentTrackNumber + 1]);
        audioNodes[currentTrackNumber + 1].start(0);
        setCurrentTrackNumber(currentTrackNumber + 1);
        setStaleTrackEnded(false);
      }
    }
  }, [staleTrackEnded]);

  async function updateLoadAndConnectTracks(playOption) {
    const filesToLoad = trackGenerator(playOption);
    await Promise.all(filesToLoad.map((url) => loadAudioFile(url)))
      .then((audioBuffers) => {
        setAudioBuffers(audioBuffers);
        connectNodesToDestination(audioBuffers);
        setIsLoading(false);
      })
      .catch(console.error);
  }

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
  useEffect(() => {
    console.log("audioNodes changed useEffect", audioNodes[currentTrackNumber]);
    if (isFirstPlaying) {
      for (let index = 0; index < audioNodes.length; index++) {
        addEventListenerOnEnded(index);
      }
    } else {
      console.log("add onEnded event listener only to the recreated node");
      // add onEnded event listener only to the recreated node
      for (let index = currentTrackNumber; index < audioNodes.length; index++) {
        addEventListenerOnEnded(index);
      }
    }
  }, [audioNodes]);

  function addEventListenerOnEnded(trackNumber) {
    const node = audioNodes[trackNumber];
    // remove previous event listener
    node.remove;
    if (trackNumber < audioNodes.length - 1) {
      console.log("add onEnded event listener to track #", trackNumber);
      node.onended = async () => {
        console.log("Track #", trackNumber, "ended");
        audioNodes[trackNumber + 1].start(0);
        setCurrentTrackNumber(trackNumber + 1);
        totalDurationOfEndedNodes.current += node.buffer.duration;
      };
    } else {
      // Last track
      console.log("add onEnded event listener to the last track");
      node.onended = async () => {
        setIsLoading(true);
        console.log("Last Track ended");
        console.log(
          audioContext.current.currentTime,
          pausedDuration.current,
          totalDurationOfSourceNodes,
          audioNodes.length
        );
        console.log(
          "Average delay per track:",
          parseFloat(
            (audioContext.current.currentTime -
              pausedDuration.current -
              totalDurationOfSourceNodes) /
              (audioNodes.length - 1)
          ).toFixed(5),
          "seconds"
        );
        console.log("base Latency:", audioContext.current.baseLatency);
        console.log("output Latency:", audioContext.current.outputLatency);
        pausedDuration.current = 0;
        audioContext.current.close();
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)({
          bufferSize: 512,
        });
        DateTimeAtPaused.current = Date.now();
        setIsFirstPlaying(true);

        setCurrentTrackNumber(0);
        setIsPlaying(false);
        totalDurationOfEndedNodes.current = 0;

        // Reload all audio files for the next play
        // useRef to get the latest ctx value in the callback
        updateLoadAndConnectTracks(ctxRef.current.playOption);
      };
    }
  }

  // For controlling the audio playback, we will use only one variable: pausedDuration
  function handleControl() {
    if (isPlaying) {
      setIsPlaying(false);
      pause();
    } else {
      setIsPlaying(true);
      resume();
    }
  }

  const pause = () => {
    console.log("PAUSE");
    audioNodes[currentTrackNumber].onended = null;
    audioNodes[currentTrackNumber].stop();
    DateTimeAtPaused.current = Date.now();
  };

  const resume = () => {
    if (DateTimeAtPaused.current != 0) {
      pausedDuration.current += (Date.now() - DateTimeAtPaused.current) / 1000;
    }
    startAudioPlayback();
    DateTimeAtPaused.current = 0;
  };

  function startAudioPlayback() {
    if (isFirstPlaying) {
      audioNodes[0].start();
      setIsFirstPlaying(false);
    } else {
      console.log("--- PLAY the track #", currentTrackNumber);
      // For resuming, create a new source node, connect it to the destination
      const pausedNode = audioContext.current.createBufferSource();
      pausedNode.buffer = audioBuffers[currentTrackNumber];
      pausedNode.connect(audioContext.current.destination);
      setAudioNodes((prev) => {
        return prev.map((node, index) => {
          if (index === currentTrackNumber) {
            return pausedNode;
          } else {
            return node;
          }
        });
      });
      console.log(
        "audioContext",
        audioContext.current.currentTime,
        "\npausedDuration",
        pausedDuration.current,
        "\ntotalDurationOfEndedNodes",
        totalDurationOfEndedNodes.current
      );
      // pauseAt is for the timestamp where the CURRENT track is paused
      let pausedAt =
        audioContext.current.currentTime -
        pausedDuration.current -
        totalDurationOfEndedNodes.current;
      if (pausedAt < 0) {
        pausedAt = 0;
      }
      // Use the pausedNode to start the playback since setAudioNodes is async
      pausedNode.start(0, pausedAt);
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
        {/* Control buttons */}
        <Controls
          isPlaying={isPlaying}
          handleControl={handleControl}
          isLoading={isLoading}
        />
        {/* Audio player */}
        {/* <audio ref={audioTrack}></audio> */}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
