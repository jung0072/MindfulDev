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
    const url = import.meta.env.VITE_BASE_URL_API;
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
        console.log("response", response);
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        setScriptDisplay(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
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
