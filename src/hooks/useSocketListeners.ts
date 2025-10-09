"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateOnlineStatus } from "@/redux/slices/chatSlice";
import { useSocket } from "@/contexts/SocketContext"; // ✅ use socket from provider

export default function useSocketListeners() {
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOnline = (userId: string) => {
      console.log("✅ userOnline:", userId);
      dispatch(updateOnlineStatus({ userId, status: true }));
    };

    const handleOffline = (data: { userId: string; lastSeen: string }) => {
      console.log("❌ userOffline:", data);
      dispatch(updateOnlineStatus({ userId: data.userId, status: false, lastSeen: data.lastSeen }));
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [dispatch, socket]);
}
