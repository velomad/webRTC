import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useTimer from "../../hooks/useTimer";
import { socket } from "../../socket";
import Button from "../Button";
import { PEER_CONNECTION_CONFIG } from "./peerConfig";
import VideoControls from "./VideoControls";
const Meet = () => {
  const localStream = useRef();
  const remoteStream = useRef();
  const { minutes, seconds } = useTimer();
  const [userName, setUserName] = useState("");
  const [callee, setCallee] = useState("");
  const [stream, setStream] = useState();
  const [users, setUsers] = useState([]);

  const peerConnection = useRef(new RTCPeerConnection(PEER_CONNECTION_CONFIG));

  useEffect(() => {
    const connection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    peerConnection.current = connection;

    // triggered when a new candidate is returned
    connection.onicecandidate = (e) => {
      if (e.candidate) {
        const request = {
          action: "candidate",
          candidate: e.candidate,
        };
        console.log("onicecandidate", request);
        // set offer sdp as local description
        socket.emit("socketID", request);
      }
    };

    // triggered when there is a change in connection state
    connection.oniceconnectionstatechange = (e) => {
      console.log("oniceconnectionstatechange", e);
    };

    // triggered when a stream is added to pc, see below - pc.addStream(stream)
    connection.onaddstream = (e) => {
      remoteStream.current.srcObject = e.stream;
    };

    (async function () {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(stream);
        connection.addStream(stream);
        localStream.current.srcObject = stream;
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <div >
        <div className="relative" style={{ width: "100%" }}>
          <video
            className="rounded-xl w-full"
            id="videoElement"
            muted
            autoPlay
            playsInline
            ref={localStream}
          />

          <div
            className="flex space-x-2 items-center  absolute top-4 py-2 rounded-xl px-8 bg-white/40"
            style={{ left: "45%" }}
          >
            <div>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3  text-red-600 rounded-xl bg-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
              </svg>
            </div>
            <div>
              {`${minutes.toString().length == 1 ? `0${minutes}` : minutes} : ${
                seconds.toString().length == 1 ? `0${seconds}` : seconds
              }`}
            </div>
          </div>

          {stream && (
            <div className="absolute bottom-8" style={{ left: "40%" }}>
              <VideoControls />
            </div>
          )}

          <video
            className="bg-gray-300 rounded-xl absolute bottom-2 right-2"
            style={{ width: 200, height: 200 }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Meet;
