import React, { useState, useEffect } from "react";
import { PEER_CONNECTION_CONFIG } from "../components/Meet/peerConfig";

const useWebRTC = () => {
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    setPeerConnection(pc);

    return () => {
      pc.close();
    };
  }, []);

  return peerConnection;
};

export default useWebRTC;
