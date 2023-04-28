import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="app-container w-full h-full p-[32px] body-font font-poppins flex flex-col justify-between">
      <Header></Header>
      <div className="flex flex-col items-center my-[200px]">
        <Link
          to="/play"
          className="btn-elevated flex flex-row items-center justify-center py-2.5 px-6 rounded-[6.25rem] shadow-lg tet-lg bg-primary-20 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-primary-30 duration-100">
          Start
        </Link>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;
