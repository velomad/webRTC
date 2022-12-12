import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { PEER_CONNECTION_CONFIG } from "../components/Meet/peerConfig";
import { socket } from "../socket";
import {
  setStream,
  setAudioTrack,
  setVideoTrack,
} from "../features/webrtc/streamSlice";

const usePeerConnection = () => {
  const dispatch = useDispatch();
  const { isVideo } = useSelector((state) => state.stream);
  const localStream = useRef();
  const remoteStream = useRef();
  const audioTrack = useRef(null);
  const videoTrack = useRef(null);

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
        // audioTrack.current = stream.getAudioTracks()[0];
        // videoTrack.current = stream.getVideoTracks()[0];
        // dispatch(setAudioTrack(audioTrack));
        // dispatch(setVideoTrack(videoTrack));
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

  return { createAnswer, createOffer, localStream, remoteStream };
};

export default usePeerConnection;
