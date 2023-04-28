// App component
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Play from "./pages/Play";
import Setting from "./pages/Setting";

// Context
import { PlayOptionProvider } from "./context/playOptionContext";

function App() {
  console.log("------App.jsx-----");

  return (
    <PlayOptionProvider>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/play" element={<Play></Play>}></Route>
        <Route path="/setting" element={<Setting></Setting>}></Route>
      </Routes>
    </PlayOptionProvider>
  );
}

export default App;
