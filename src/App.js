import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

import WikiContent from "./components/WikiContent";
import GazeMovement from "./components/GazeMovement";

function App() {
  const [eyePositions, setEyePositions] = useState([]);
  const [averages, setAverages] = useState({});

  useEffect(() => {
    // connect to the socketio server
    const socket = io("http://localhost:5000");

    // update the state with the new eye position
    socket.on("state", (stateUpdate) => {
      const eyes = [...eyePositions];
      if (eyes.length >= 4) {
        eyes.shift();
      }
      eyes.push({ x: stateUpdate["/gaze/x"], y: stateUpdate["/gaze/y"] });

      // average out the fixation positions
      const avgs = eyes.reduce(
        (acc, point) => {
          return { x: acc.x + point.x, y: acc.y + point.y };
        },
        { x: 0, y: 0 }
      );
      avgs.x /= eyes.length;
      avgs.y /= eyes.length;

      setAverages(avgs);
      setEyePositions(eyes);
    });

    return () => {
      // disconnect from the server on unmount
      socket.disconnect();
    };
  });
  return (
    <div>
      <GazeMovement
        y={averages?.y * window.innerHeight}
        x={averages?.x * window.innerWidth}
      >
        <WikiContent />
      </GazeMovement>
    </div>
  );
}

export default App;
