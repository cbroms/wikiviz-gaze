import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

import WikiContent from "./components/WikiContent";
import GazeMovement from "./components/GazeMovement";

function App() {
  const [eyePosition, setEyePosition] = useState(null);
  useEffect(() => {
    // connect to the socketio server
    const socket = io("http://localhost:5000");

    // update the state with the new eye position
    socket.on("state", (stateUpdate) => {
      setEyePosition(stateUpdate);
    });

    return () => {
      // disconnect from the server on unmount
      socket.disconnect();
    };
  });
  return (
    <div>
      <GazeMovement
        y={
          eyePosition
            ? eyePosition["/gaze/y"] * window.innerHeight
            : window.innerHeight / 2
        }
        x={
          eyePosition
            ? eyePosition["/gaze/x"] * window.innerWidth
            : window.innerWidth / 2
        }
      >
        <WikiContent />
      </GazeMovement>
    </div>
  );
}

export default App;
