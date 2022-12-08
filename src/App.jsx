import React, { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Meet from "./components/Meet";
import usePeerConnection from "./hooks/usePeerConnection";
import { socket } from "./socket";

function App() {
  const [socketID, setSocketID] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
    });
  }, []);

  return (
    <React.Fragment>
      <div className="grid grid-cols-8 p-4 gap-x-4">
        <div className="col-span-5">
          <Meet />
        </div>
        <div className="col-span-3">
          <Chat socketID={socketID} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
