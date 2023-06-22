import "regenerator-runtime/runtime";
import React, { useEffect, useRef, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Controls from "../components/audioPlayer/Controls";

import { PlayOptionContext } from "../context/playOptionContext";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  Grid,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Paper,
  Radio,
  Select,
  Snackbar,
  Stepper,
  Switch,
  Table,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

const Play = () => {
  const ctx = React.useContext(PlayOptionContext);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleVoiceRecordBtn = () => {
    if (isListening) {
      stopHandle();
    } else {
      handleListing();
    }
  };

  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    setInput(transcript);
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  // !! API CALL !!
  const [input, setInput] = useState("");
  const [scriptDisplay, setScriptDisplay] = useState("");

  function callAPIWithInput() {
    const url = import.meta.env.VITE_BASE_URL_API_HEROKU;
    console.log("call API with input: ", input);
    const scriptData = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => {
        // console.log("response", response);
        return response.blob();
      })
      .then((blob) => {
        // console.log("data", data);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;

          console.log("result", result);
          
          // Parse the multipart response
          const parts = parseMultipartResponse(result);

          // Extract the script and audio parts
          const scriptPart = findPartByContentType(parts, "text/plain");
          const audioPart = findPartByContentType(parts, "audio/mpeg");

          // Get the script and audio data
          const scriptData = scriptPart.content;
          const audioData = audioPart.content;

          // Process the script and audio data as needed
          setScriptDisplay(scriptData);

          audioData = blob.audio;
          var blob = new Blob([audioData], { type: "audio/mpeg" }); // Adjust the 'type' according to the actual audio format

          // Create a URL for the Blob object
          var audioUrl = URL.createObjectURL(blob);

          // Create an audio element
          var audio = new Audio(audioUrl);

          // Play the audio
          audio.play();
        };
        reader.readAsText(blob);        
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  function parseMultipartResponse(responseText) {
    const boundary = getBoundaryFromContentType(
      responseText.headers.get("Content-Type")
    );
    const parts = responseText
      .split(`--${boundary}`)
      .filter((part) => part.trim() !== "");

    return parts.map((part) => {
      const [header, content] = part.split("\r\n\r\n");
      const headers = parseHeaders(header);

      return {
        headers,
        content: content.trim(),
      };
    });
  }

  function findPartByContentType(parts, contentType) {
    return parts.find((part) => part.headers["Content-Type"] === contentType);
  }

  function getBoundaryFromContentType(contentType) {
    const match = /boundary=(?:"([^"]+)"|([^;]+))/.exec(contentType);
    return match[1] || match[2];
  }

  function parseHeaders(headerText) {
    const headers = {};
    const lines = headerText.trim().split("\r\n");

    for (let line of lines) {
      const [name, value] = line.split(":");
      headers[name.trim()] = value.trim();
    }

    return headers;
  }

  return (
    <div className="app-container w-full h-full p-[32px] body-font font-poppins flex flex-col justify-between">
      <Header pathNameFirstPart="play"></Header>
      <div className="w-full">
        <div className="w-full flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-2">
            <div className="w-full flex">
              <TextField
                id="outlined-basic"
                label="Type what you want to change..."
                variant="outlined"
                multiline
                className="w-full"
                value={isListening ? transcript : input}
                onChange={(e) => {
                  console.log("e.target.value", e.target.value);
                  setInput(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      ref={microphoneRef}
                      variant="text"
                      className=""
                      onClick={handleVoiceRecordBtn}>
                      {isListening ? "Stop" : "Voice"}
                    </Button>
                  ),
                }}
              />
            </div>
            <Button
              variant="contained"
              onClick={() => {
                setIsListening(false);
                callAPIWithInput();
              }}>
              Enter
            </Button>
          </div>
          <div>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                {scriptDisplay}
              </Typography>
            </Box>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Play;
