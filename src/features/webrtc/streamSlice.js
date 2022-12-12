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
      state.stream.getAudioTracks()[0].enabled = payload;
    },
    toggleVideo: (state, action) => {
      const { payload } = action;
      state.isVideo = payload;
      state.stream.getVideoTracks()[0].enabled = payload;
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
