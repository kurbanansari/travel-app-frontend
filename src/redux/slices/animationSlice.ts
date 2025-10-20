// redux/animationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAnimation, deleteAnimation, fetchAnimationById, fetchUserAnimations, publishAnimation } from "@/redux/thunk/animationThunk";
import { animationStyles , animationMusic ,animationStatus} from "@/redux/thunk/animationThunk";
import toast from "react-hot-toast";


export interface Animation {
  id: string;
  title: string;
  user_id: string; 
  video_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  animation_style: { name: string };
  music_track: { title: string; artist: string };
  trip: { title: string };
}

type AnimationStyle = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
};


interface AnimationState {
  selectedAnimation: any | null;
  loadingSelected: boolean;
  errorSelected: string | null;
   animations: Animation[];
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
   pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
}

const initialState: AnimationState = {
  selectedAnimation: null,
  loadingSelected: false,
  errorSelected: null,
   animations: [],
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
   pagination: null,
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
     clearSelectedAnimation(state) {
      state.selectedAnimation = null;
      state.errorSelected = null;
      state.loadingSelected = false;
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
        // ✅ Add the new animation to the profile grid immediately
  // if (action.payload.animation) {
  //   state.animations.unshift(action.payload.animation); // latest on top
  // }
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
         toast.success("Animation published successfully!");
      })
      .addCase(publishAnimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to publish animation";
      })
       .addCase(fetchUserAnimations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
         .addCase(fetchUserAnimations.fulfilled, (state, action) => {
  state.loading = false;
  const fetchedAnimations = action.payload.animations || [];
  const { page = 1 } = action.meta.arg || {};

  if (page === 1) {
    // First page → replace
    state.animations = fetchedAnimations;
  } else {
    // Next pages → append and deduplicate
    const combined = [...state.animations, ...fetchedAnimations];
    const animationMap = new Map(combined.map((a) => [a.id, a]));
    state.animations = Array.from(animationMap.values());
  }

  state.pagination = action.payload.pagination;
})
      .addCase(fetchUserAnimations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(fetchAnimationById.pending, (state) => {
        state.loadingSelected = true;
        state.errorSelected = null;
      })
      .addCase(fetchAnimationById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingSelected = false;
        state.selectedAnimation = action.payload;
      })
      .addCase(fetchAnimationById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.errorSelected = action.payload as string;
      })
       // ✅ Delete animation
      .addCase(deleteAnimation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnimation.fulfilled, (state, action) => {
        state.loading = false;
          const deletedId = action.payload?.id;
  if (deletedId) {
    state.animations = state.animations.filter(a => a.id !== deletedId);
    if (state.selectedAnimation?.id === deletedId) {
      state.selectedAnimation = null;
    }
    toast.success("Animation deleted successfully!");
  }
      })
      .addCase(deleteAnimation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to delete animation");
      });
},
});

export const { resetAnimation ,resetPublishState,clearSelectedAnimation } = animationSlice.actions;
export default animationSlice.reducer;
