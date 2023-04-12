import "./App.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="w-full h-full p-[32px] body-font font-poppins flex flex-col justify-between">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/play" element={<Play></Play>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
