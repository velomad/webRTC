import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import usePeerConnection from "../../hooks/usePeerConnection";
import useTimer from "../../hooks/useTimer";
import { socket } from "../../socket";
import Button from "../Button";
import { PEER_CONNECTION_CONFIG } from "./peerConfig";
import VideoControls from "./VideoControls";
const Meet = () => {
  const { createAnswer, createOffer, localStream, remoteStream } =
    usePeerConnection();
  const { minutes, seconds } = useTimer();
  return (
    <React.Fragment>
      <div>
        <div className="flex space-x-4 p-4">
          <Button onClick={createOffer}>Call</Button>
          <Button onClick={createAnswer}>Answer</Button>
        </div>

        <div className="relative" style={{ width: "100%" }}>
          <video
            className="rounded-xl w-full"
            id="videoElement"
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

          <div className="absolute bottom-8" style={{ left: "40%" }}>
            <VideoControls />
          </div>

          <video
            id="videoElement"
            autoPlay
            playsInline
            ref={remoteStream}
            className="rounded-xl absolute bottom-2 right-2"
            style={{ width: 200, borderRadius: "10%" }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Meet;
