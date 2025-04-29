import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Chat } from "@/components/Chat";

export const ChatPage = () => {
  const { fetchUsers } = useChatStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-full">
      <Chat />
    </div>
  );
};
