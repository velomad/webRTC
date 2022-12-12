import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stream: null,
  isMuted: false,
  audioTrack: null,
  videoTrack: null,
  isVideo: true,
};

export const counterSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStream: (state, action) => {
      state.stream = action.payload;
    },
    toggleMicrophone: (state, action) => {
      const { payload } = action;
      state.isMuted = payload;
      state.audioTrack.enabled = payload;
    },
    toggleVideo: (state, action) => {
      const { payload } = action;
      state.isVideo = payload;
        console.log(payload);
      //   state.videoTrack.enabled = payload;
      state.stream.getVideoTracks()[0].enabled = payload;
    },
    setAudioTrack: (state, action) => {
      const { payload } = action;
      state.audioTrack = payload.current;
    },
    setVideoTrack: (state, action) => {
      const { payload } = action;
      state.videoTrack = payload.current;
    },
  },
});


// Action creators are generated for each case reducer function
export const {
  setStream,
  toggleMicrophone,
  setAudioTrack,
  toggleVideo,
  setVideoTrack,
} = counterSlice.actions;

export default counterSlice.reducer;
