// redux/animationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { createAnimation } from "@/redux/thunk/animationThunk";
import { animationStyles , animationMusic ,animationStatus} from "@/redux/thunk/animationThunk";



type AnimationStyle = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
};


interface AnimationState {
    styles: AnimationStyle[];
    status: string | null;
      music: any[];
        videoUrl: string | null;
  loading: boolean;
  error: string | null;
  animationId: string | null;
  message: string | null;
}

const initialState: AnimationState = {
   styles: [],
     music: [],
     status: null,
      videoUrl: null, // <-- add this
  loading: false,
  error: null,
  animationId: null,
  message: null,
};

const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    resetAnimation(state) {
      state.animationId = null;
      state.message = null;
      state.error = null;
      state.loading = false;
       state.videoUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnimation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.animationId = null;
        state.message = null;
         state.videoUrl = null;
      })
      .addCase(createAnimation.fulfilled, (state, action) => {
        state.loading = false;
        state.animationId = action.payload.animationId;
        state.message = action.payload.message;
      })
      .addCase(createAnimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(animationStyles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(animationStyles.fulfilled, (state, action) => {
        state.loading = false;
        state.styles = action.payload.data || [];
      })
      .addCase(animationStyles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 🎵 Music
    builder
      .addCase(animationMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(animationMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.music = action.payload.data || [];
      })
      .addCase(animationMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(animationStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(animationStatus.fulfilled, (state, action) => {
        state.loading = false; // ✅ must stop loading
  const status = action.payload.status;
  state.status = status;

  if (status === "ready" && state.animationId) {
    state.videoUrl = `http://localhost:8080/animations/${state.animationId}.mp4`;
  } else if (status === "failed") {
    state.error = "Animation generation failed.";
    state.videoUrl = null;
  }
})
.addCase(animationStatus.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});
},
});

export const { resetAnimation } = animationSlice.actions;
export default animationSlice.reducer;
