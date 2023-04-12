import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center my-[200px]">
      <div className="btn-elevated flex flex-row items-center justify-center py-2.5 px-6 rounded-[6.25rem] shadow-lg tet-lg bg-primary-20">
        <Link to="/play">Start</Link>
      </div>
    </div>
  );
};

export default Home;
