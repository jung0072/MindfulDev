import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center my-[200px]">
      <Link
        to="/play"
        className="btn-elevated flex flex-row items-center justify-center py-2.5 px-6 rounded-[6.25rem] shadow-lg tet-lg bg-primary-20 transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-primary-30 duration-100">
        Start
      </Link>
    </div>
  );
};

export default Home;
