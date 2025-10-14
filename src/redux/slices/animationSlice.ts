// redux/animationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAnimation, publishAnimation } from "@/redux/thunk/animationThunk";
import { animationStyles , animationMusic ,animationStatus} from "@/redux/thunk/animationThunk";



type AnimationStyle = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
};


interface AnimationState {
    styles: AnimationStyle[];
    data: any | null;
     successMessage: string | null;
    status: string | null;
      music: any[];
        videoUrl: string | null;
  loading: boolean;
  error: string | null;
  animationId: string | null;
  message: string | null;
}

const initialState: AnimationState = {
   data: null,
   successMessage: null,
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
     resetPublishState(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.data = null;
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
  
  state.loading = false;
  const backendStatus = action.payload.data?.status; // e.g., "COMPLETED"
  state.status = backendStatus;

  if (backendStatus === "COMPLETED") {
    state.videoUrl = action.payload.data?.video_url || null;
  } else if (backendStatus === "FAILED") {
    state.error = "Animation generation failed.";
    state.videoUrl = null;
  }
})

.addCase(animationStatus.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
 .addCase(publishAnimation.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(publishAnimation.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Animation published successfully";
        state.data = action.payload.data || null;
      })
      .addCase(publishAnimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to publish animation";
      });
},
});

export const { resetAnimation ,resetPublishState} = animationSlice.actions;
export default animationSlice.reducer;
