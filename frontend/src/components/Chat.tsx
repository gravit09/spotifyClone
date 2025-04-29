import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export const Chat = () => {
  const { onlineUsers, messages, sendMessage } = useSocketStore();
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    sendMessage(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* Online Users List */}
      <div className="w-64 border-r border-gray-800 p-4">
        <h2 className="text-lg font-semibold mb-4">Online Users</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {Array.from(onlineUsers.values()).map((onlineUser) => (
            <div
              key={onlineUser.userId}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800"
            >
              <div className="relative">
                <img
                  src={onlineUser.imageUrl}
                  alt={onlineUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{onlineUser.username}</p>
                <p className="text-xs text-gray-400 truncate">
                  {onlineUser.currentSong
                    ? `Playing: ${onlineUser.currentSong.title}`
                    : "Not playing anything"}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.userId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.userId === user?.id ? "bg-green-600" : "bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <img
                      src={msg.imageUrl}
                      alt={msg.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium">{msg.username}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
