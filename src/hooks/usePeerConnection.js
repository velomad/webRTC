import React, { useEffect, useRef } from "react";
import { PEER_CONNECTION_CONFIG } from "../components/Meet/peerConfig";
import { socket } from "../socket";
const usePeerConnection = () => {
  const localStream = useRef();
  const remoteStream = useRef();
  const peerConnection = useRef(new RTCPeerConnection(PEER_CONNECTION_CONFIG));

  useEffect(() => {
    const _pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    peerConnection.current = _pc;

    socket.on("onCall", (data) => {
      // setIncommingCall && setIncommingCall(true);
      console.log("incomingCall event received");
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.signalData)
      );
    });
    socket.on("callAccepted", (data) => {
      console.log("call has been answered");
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.signalData)
      );
    });

    socket.on("candidate", (data) => {
      console.log("-------incomming perr connection---------", data);
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
        console.log("run hua pencho pudiya parooo fridayyyyy", request);
        // set offer sdp as local description
        socket.emit("candidate", request);
      }
    };

    // triggered when there is a change in connection state
    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    // triggered when a stream is added to pc, see below - pc.addStream(stream)
    _pc.onaddstream = (e) => {
      console.log(e);
      remoteStream.current.srcObject = e.stream;
    };

    (async function () {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        // setStream(stream);
        window.localStream = stream;
        localStream.current.srcObject = stream;
        _pc.addStream(stream);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const createOffer = async (data) => {
    const sdp = await peerConnection.current.createOffer({
      offerToReceiveVideo: 1,
    });
    const request = {
      signalData: sdp,
    };
    console.log(request);
    // set offer sdp as local description
    peerConnection.current.setLocalDescription(sdp);
    socket.emit("call", request);
  };

  const createAnswer = async (data) => {
    const sdp = await peerConnection.current.createAnswer({
      offerToReceiveVideo: 1,
    });
    // set answer sdp as local description
    peerConnection.current.setLocalDescription(sdp);
    const request = {
      signalData: sdp,
    };
    socket.emit("answer", request);
  };

  return { createAnswer, createOffer, localStream, remoteStream };
};

export default usePeerConnection;
