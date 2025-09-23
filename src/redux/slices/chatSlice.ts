"use client"
// // // src/redux/slices/chatSlice.ts
// // import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// // import { fetchConversation, fetchConversations, sendMessage } from "../thunk/chatThunk";

// // interface User {
// //   id: string;
// //   name: string;
// //   profile_pic_url: string | null;
// //   online?: boolean;
// // }

// // interface Message {
// //   id: string;
// //   message: string;
// //   sent_at: string;
// //   sender: User;
// //   receiver: User;
// // }
// // interface ChatState {
// //   conversations: any[];
// //    messages: Message[];
// //   loading: boolean;
// //   error: string | null;
// // }

// // const initialState: ChatState = {
// //   conversations: [],
// //    messages: [],
// //   loading: false,
// //   error: null,
// // };

// // const chatSlice = createSlice({
// //   name: "chat",
// //   initialState,
// //   reducers: {
// //     clearConversations: (state) => {
// //       state.conversations = [];
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchConversations.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(
// //         fetchConversations.fulfilled,
// //         (state, action: PayloadAction<any[]>) => {
// //           state.loading = false;
// //           state.conversations = action.payload;
// //         }
// //       )
// //       .addCase(fetchConversations.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })
// //       // ✅ Messages (conversation)
// //     builder
// //       .addCase(fetchConversation.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchConversation.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.messages = action.payload;
// //       })
// //       .addCase(fetchConversation.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })
      
// //       // Send message
// //       .addCase(sendMessage.pending, (state) => {
// //         state.error = null;
// //       })
// //       .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
// //         state.messages.push(action.payload);
// //       })
// //       .addCase(sendMessage.rejected, (state, action) => {
// //         state.error = action.payload as string;
// //       });
// //   },
// // });

// // export const { clearConversations } = chatSlice.actions;
// // export default chatSlice.reducer;

// // src/redux/slices/chatSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { fetchConversation, fetchConversations, sendMessage } from "../thunk/chatThunk";

// interface User {
//   id: string;
//   name: string;
//   profile_pic_url: string | null;
//   online?: boolean;
// }

// interface Message {
//   id: string;
//   message: string;
//   sent_at: string;
//   sender: User;
//   receiver: User;
// }

// interface Conversation {
//   otherUser: User;
//   lastMessage: Message | null;
//   unreadCount: number;
// }

// interface ChatState {
//   conversations: Conversation[];
//   messages: Message[];
//   selectedUser: User | null; // Add selectedUser
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ChatState = {
//   conversations: [],
//   messages: [],
//   selectedUser: null,
//   loading: false,
//   error: null,
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     clearConversations: (state) => {
//       state.conversations = [];
//       state.error = null;
//     },
//     setSelectedUser: (state, action: PayloadAction<User | null>) => {
//       state.selectedUser = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//     .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
//         state.loading = false;
//         // Deduplicate conversations in case API still returns duplicates
//         const uniqueConversations = Array.from(
//           new Map(action.payload.map((c) => [c.otherUser.id, c])).values()
//         );
//         state.conversations = uniqueConversations;
//         }
//       )
//       .addCase(fetchConversations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchConversation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConversation.fulfilled, (state, action: PayloadAction<Message[]>) => {
//         state.loading = false;
//         state.messages = action.payload;
//       })
//       .addCase(fetchConversation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(sendMessage.pending, (state) => {
//         state.error = null;
//       })
//       .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
//         state.messages.push(action.payload);
//         // Update or add conversation
//         const existingConversation = state.conversations.find(
//           (c) => c.otherUser.id === action.payload.receiver.id
//         );
//         if (existingConversation) {
//           existingConversation.lastMessage = action.payload;
//           existingConversation.unreadCount = 0;
//         } else if (state.selectedUser) {
//           state.conversations.push({
//             otherUser: state.selectedUser,
//             lastMessage: action.payload,
//             unreadCount: 0,
//           });
//         }
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearConversations, setSelectedUser } = chatSlice.actions;
// export default chatSlice.reducer;

// src/redux/slices/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchConversation, fetchConversations, sendMessage } from "../thunk/chatThunk";

interface User {
  id: string;
  name: string;
  profile_pic_url: string | null;
  online?: boolean;
}

interface Message {
  id: string;
  message: string;
  sent_at: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      console.log("chatSlice - setSelectedUser:", action.payload); // Debug
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        // Deduplicate conversations in case API still returns duplicates
        const uniqueConversations = Array.from(
          new Map(action.payload.map((c) => [c.otherUser.id, c])).values()
        );
        state.conversations = uniqueConversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
        const existingConversation = state.conversations.find(
          (c) => c.otherUser.id === action.payload.receiver.id
        );
        if (existingConversation) {
          existingConversation.lastMessage = action.payload;
          existingConversation.unreadCount = 0;
        } else if (state.selectedUser) {
          state.conversations.push({
            otherUser: state.selectedUser,
            lastMessage: action.payload,
            unreadCount: 0,
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearConversations, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;