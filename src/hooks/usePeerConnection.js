import React, { useEffect, useRef } from "react";
import { PEER_CONNECTION_CONFIG } from "../components/Meet/peerConfig";
import { socket } from "../socket";
const usePeerConnection = () => {
  const peerConnection = useRef(new RTCPeerConnection(PEER_CONNECTION_CONFIG));

  const createOffer = async (data) => {
    const sdp = await peerConnection.current.createOffer({
      offerToReceiveVideo: 1,
    });
    const request = {
      signalData: sdp,
      toCall: data.toCall,
      fromCall: data.fromCall,
    };
    // set offer sdp as local description
    peerConnection.current.setLocalDescription(sdp);
    socket.emit("call", request);
  };

  const createAnswer = async (data) => {
    const sdp = await peerConnection.current.createAnswer({
      offerToReceiveVideo: 1,
    });
    peerConnection.current.setLocalDescription(sdp);
    const request = {
      toCall: data.toCall,
      fromCall: data.fromCall,
      signalData: sdp,
    };
    socket.emit("answerCall", request);
  };

  return { createAnswer, createOffer };
};

export default usePeerConnection;
