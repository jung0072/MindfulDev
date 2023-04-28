import React from "react";

const PlayOptionContext = React.createContext();

const PlayOptionProvider = ({ children }) => {
  const [playOption, setPlayOptionContext] = React.useState({
    duration: "10mins",
    level: "intermediate",
    bgMusic: "rain",
  });

  // React.useEffect(() => {
  //   console.log("------playOptionContext.jsx-----");
  //   console.log("playOption: ", playOption);

  // }, [playOption]);

  return (
    <PlayOptionContext.Provider value={{ playOption, setPlayOptionContext }}>
      {children}
    </PlayOptionContext.Provider>
  );
};

export { PlayOptionContext, PlayOptionProvider };
