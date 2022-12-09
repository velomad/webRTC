import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import Chat from "./components/Chat";
import Meet from "./components/Meet";
import usePeerConnection from "./hooks/usePeerConnection";
import { socket } from "./socket";

function App() {
  const [socketID, setSocketID] = useState("");
  const [isIncommingCall, setIncommingCall] = useState(false);

  const { createAnswer, createOffer } = usePeerConnection();

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
    });
  }, []);

  return (
    <React.Fragment>
      {/* <div className="flex space-x-4 p-4">
        <Button onClick={createOffer}>Call</Button>
        <Button onClick={createAnswer}>Answer</Button>
      </div> */}
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
