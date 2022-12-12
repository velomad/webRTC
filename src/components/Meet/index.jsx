import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useTimer from "../../hooks/useTimer";
import { socket } from "../../socket";
import Button from "../Button";
import { PEER_CONNECTION_CONFIG } from "./peerConfig";
import VideoControls from "./VideoControls";
import captureScreenShot from "../../utils/captureScreenShot";
import { useSelector, useDispatch } from "react-redux";
import { setStream } from "../../features/webrtc/streamSlice";

const Meet = () => {
  const { minutes, seconds } = useTimer();

  const [showScreenShot, setShowScreenShot] = useState(false);

  const dispatch = useDispatch();
  const localStream = useRef();
  const remoteStream = useRef();

  const peerConnection = useRef(new RTCPeerConnection(PEER_CONNECTION_CONFIG));

  useEffect(() => {
    const _pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    peerConnection.current = _pc;

    socket.on("onCall", (data) => {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.signalData)
      );
    });
    socket.on("callAccepted", (data) => {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.signalData)
      );
    });

    socket.on("candidate", (data) => {
      peerConnection.current.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    });

    // triggered when a new candidate is returned on call create and answer
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        const request = {
          candidate: e.candidate,
        };
        socket.emit("candidate", request);
      }
    };

    // triggered when there is a change in connection state
    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    _pc.onaddstream = (e) => {
      remoteStream.current.srcObject = e.stream;
    };

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        setStream(stream);
        dispatch(setStream(stream));
        localStream.current.srcObject = stream;
        _pc.addStream(stream);
      })
      .catch((err) => console.log(err));
  }, []);

  const createOffer = async (data) => {
    const sdp = await peerConnection.current.createOffer({
      offerToReceiveVideo: 1,
    });
    const request = {
      signalData: sdp,
    };
    peerConnection.current.setLocalDescription(sdp);
    socket.emit("call", request);
  };

  const createAnswer = async (data) => {
    const sdp = await peerConnection.current.createAnswer({
      offerToReceiveVideo: 1,
    });
    peerConnection.current.setLocalDescription(sdp);
    const request = {
      signalData: sdp,
    };
    socket.emit("answer", request);
  };

  const closeDownloadScreenShot = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowScreenShot(false);
  };

  const handleDownloadScreenShot = () => {
    var link = document.createElement("a");
    link.download = "filename.png";
    link.href = document.getElementById("mycanvas").toDataURL();
    link.click();
  };

  return (
    <React.Fragment>
      <div>
        <div className="flex space-x-4 p-4">
          <Button onClick={createOffer}>Call</Button>
          <Button onClick={createAnswer}>Answer</Button>
        </div>

        <div className="relative" style={{ width: "100%" }}>
          <video
            className=" rounded-xl w-full bg-black"
            id="myVideo"
            autoPlay
            playsInline
            ref={remoteStream}
          />

          <div className="flex justify-between items-center absolute top-4 left-4 right-4">
            <div className="flex space-x-2 items-center  py-2 rounded-xl px-8 bg-white/40">
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
                {`${
                  minutes.toString().length == 1 ? `0${minutes}` : minutes
                } : ${
                  seconds.toString().length == 1 ? `0${seconds}` : seconds
                }`}
              </div>
            </div>
            <div
              className="video-control-btn"
              onClick={() => {
                setShowScreenShot(true);
                captureScreenShot();
              }}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>

              <div className="relative">
                <div className="absolute -right-2 top-10">
                  <canvas
                    id="mycanvas"
                    className={`z-10 rounded-xl object-fit ${
                      showScreenShot ? " shadow-4xl " : null
                    } `}
                    width={250}
                    height={200}
                    style={{ overflow: "hidden" }}
                  ></canvas>
                  {showScreenShot && (
                    <div className="absolute top-2 right-2 bottom-2 flex flex-col justify-between">
                      <div
                        className=" bg-red-600 rounded-full h-8 w-8 flex justify-center items-center"
                        onClick={(e) => closeDownloadScreenShot(e)}
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div
                        className=" bg-gray-800 rounded-full h-8 w-8 flex justify-center items-center"
                        onClick={handleDownloadScreenShot}
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center absolute bottom-8 left-4 right-4">
            <VideoControls />
          </div>
          <div className="relative">
            <video
              id="myVideo"
              autoPlay
              muted
              playsInline
              ref={localStream}
              className="rounded-xl absolute bottom-2 right-2"
              style={{ width: 200, borderRadius: "10%" }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Meet;
