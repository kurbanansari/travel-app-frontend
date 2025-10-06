// "use client"

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { fetchConversation, fetchConversations, markMessagesAsRead, sendMessage } from "../thunk/chatThunk";

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
//   selectedUser: User | null;
//   // selectedUser: Partial<UserListItem> | null;
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
//       console.log("chatSlice - setSelectedUser:", action.payload); // Debug
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
//         state.loading = false;
//         // Deduplicate conversations in case API still returns duplicates
//         const uniqueConversations = Array.from(
//           new Map(action.payload.map((c) => [c.otherUser.id, c])).values()
//         );
//         state.conversations = uniqueConversations;
//       })
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
//       })
//       .addCase(markMessagesAsRead.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(markMessagesAsRead.fulfilled, (state, action) => {
//         state.loading = false;
//         // Update unreadCount for the conversation
//         const otherUserId = action.meta.arg.otherUserId;
//         const conversation = state.conversations.find((c) => c.otherUser.id === otherUserId);
//         if (conversation) {
//           conversation.unreadCount = 0;
//         }
//       })
//       .addCase(markMessagesAsRead.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearConversations, setSelectedUser } = chatSlice.actions;
// export default chatSlice.reducer;

"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchConversation, fetchConversations, markMessagesAsRead, sendMessage } from "../thunk/chatThunk";
// import { setSelected } from "./selectedphotosSlice";

interface User {
  id: string;
  name: string;
  profile_pic_url: string | null;
  online?: boolean;
}

export interface Message {
  id: string;
  message: string;
  sent_at: string;
  sender: User;
  receiver: User;
   timestamp: string | any;
  read?: boolean;
   tempId?: string;
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
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
        // remove duplicates
      const uniqueMessages = Array.from(new Map(action.payload.map(m => [m.id, m])).values());
      state.messages = uniqueMessages;
    },
    clearChat: (state) => {
      state.conversations = [];
      state.messages = [];
      state.selectedUser = null;
    },
  
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
    },
     // 🚀 handle incoming socket message
// messageReceived: (state, action: PayloadAction<Message>) => {
//       const incoming = action.payload;

      
//   // 1️⃣ Check for duplicates or temp messages
//       const index = state.messages.findIndex(
//         (m) => m.id === incoming.id || (incoming.tempId && m.tempId === incoming.tempId)
//       );

//   if (index >= 0) {
//     // Replace temp message with server message
//     state.messages[index] = incoming;
//   } else {
//     // Add new message
//     state.messages.push(incoming);
//   }

//       // 2️⃣ Update conversation or create new
//       const conv = state.conversations.find(
//         (c) =>
//           c.otherUser.id === incoming.sender.id ||
//           c.otherUser.id === incoming.receiver.id
//       );

//       const otherUser =
//         incoming.sender.id !== state.selectedUser?.id
//           ? incoming.sender
//           : incoming.receiver;

//       if (conv) {
//         conv.lastMessage = incoming;
//         if (incoming.sender.id === conv.otherUser.id) {
//           conv.unreadCount += 1;
//         }
//       } else {
//         state.conversations.push({
//           otherUser,
//           lastMessage: incoming,
//           unreadCount: incoming.sender.id === otherUser.id ? 1 : 0,
//         });
//       }

//       // Optional: sort conversations by last message timestamp
//       state.conversations.sort(
//         (a, b) =>
//           (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0)
//       );
//     },
messageReceived: (state, action: PayloadAction<Message>) => {
      const incoming = action.payload;
      console.log("messageReceived:", { id: incoming.id, message: incoming.message, sender: incoming.sender.id, receiver: incoming.receiver.id }); // Line 56: Debug log

      // Deduplicate by id or content+sender+receiver+timestamp
      const index = state.messages.findIndex(
        (m) =>
          m.id === incoming.id ||
          (m.message === incoming.message &&
           m.sender.id === incoming.sender.id &&
           m.receiver.id === incoming.receiver.id &&
           Math.abs(new Date(m.sent_at).getTime() - new Date(incoming.sent_at).getTime()) < 500) // Line 62: Content-based deduplication
      );

      if (index >= 0) {
        console.log("Replacing duplicate message at index:", index); // Line 66: Debug log
        state.messages[index] = incoming;
      } else {
        console.log("Adding new message:", incoming.message); // Line 69: Debug log
        state.messages.push(incoming);
      }

  // Update conversation
  const conv = state.conversations.find(
    (c) =>
      c.otherUser.id === incoming.sender.id ||
      c.otherUser.id === incoming.receiver.id
  );

  const otherUser =
    incoming.sender.id !== state.selectedUser?.id
      ? incoming.sender
      : incoming.receiver;

  if (conv) {
    conv.lastMessage = incoming;
    if (incoming.sender.id === conv.otherUser.id) {
      conv.unreadCount += 1;
    }
  } else {
    state.conversations.push({
      otherUser,
      lastMessage: incoming,
      unreadCount: incoming.sender.id === otherUser.id ? 1 : 0,
    });
  }

  // Sort conversations by last message timestamp
  state.conversations.sort(
    (a, b) =>
      new Date(b.lastMessage?.timestamp || 0).getTime() -
      new Date(a.lastMessage?.timestamp || 0).getTime()
  );
},
removeMessage: (state, action: PayloadAction<string>) => { // Line 104: Added removeMessage reducer
     state.messages = state.messages.filter(
        (m) => m.id !== action.payload && m.tempId !== action.payload
      );
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
        // state.messages = action.payload;
        const uniqueMessages = Array.from(new Map(action.payload.map(m => [m.id, m])).values()); // Line 116: Deduplicate by id
        state.messages = uniqueMessages;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      
      console.log("sendMessage.fulfilled:", { id: action.payload.id, message: action.payload.message, sender: action.payload.sender.id, receiver: action.payload.receiver.id }); // Line 125: Debug log
        const index = state.messages.findIndex(
          (m) =>
            m.id === action.payload.id ||
            (m.message === action.payload.message &&
             m.sender.id === action.payload.sender.id &&
             m.receiver.id === action.payload.receiver.id &&
             Math.abs(new Date(m.sent_at).getTime() - new Date(action.payload.sent_at).getTime()) < 500) // Line 129: Content-based deduplication
        );

        if (index >= 0) {
          console.log("Replacing duplicate message in sendMessage.fulfilled at index:", index); // Line 133: Debug log
          state.messages[index] = action.payload;
        } else {
          console.log("Adding new message in sendMessage.fulfilled:", action.payload.message); // Line 136: Debug log
          state.messages.push(action.payload);
        }
        // Update conversation
        const conv = state.conversations.find(
          (c) =>
            c.otherUser.id === action.payload.sender.id ||
            c.otherUser.id === action.payload.receiver.id
        );
        const otherUser =
          action.payload.sender.id !== state.selectedUser?.id
            ? action.payload.sender
            : action.payload.receiver;
        if (conv) conv.lastMessage = action.payload;
        else
          state.conversations.push({
            otherUser,
            lastMessage: action.payload,
            unreadCount: 0,
          });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId;
        const conv = state.conversations.find((c) => c.otherUser.id === otherUserId);
        if (conv) conv.unreadCount = 0;
        state.messages = state.messages.map((m) =>
          m.sender.id === otherUserId ? { ...m, read: true } : m
        );
      
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearConversations, setSelectedUser,setMessages,clearChat,removeMessage ,setConversations,messageReceived} = chatSlice.actions;
export default chatSlice.reducer;

