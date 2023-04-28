import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OptionButton from "../components/OptionButton";

const Setting = () => {
  return (
    <div className="app-container w-full h-full p-[32px] body-font font-poppins flex flex-col justify-between">
      <Header pathNameFirstPart="setting"></Header>
      <div className="flex flex-col gap-10 h-full pt-10">
        <div className="flex flex-col gap-5">
          <h2>Duration</h2>
          <div className="flex flex-row justify-between">
            <OptionButton text="15mins" ></OptionButton>
            <OptionButton text="10mins"></OptionButton>
            <OptionButton text="15mins"></OptionButton>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2>Duration</h2>
          <div className="flex flex-row justify-between">
            <OptionButton text="15mins"></OptionButton>
            <OptionButton text="10mins"></OptionButton>
            <OptionButton text="15mins"></OptionButton>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Setting;
