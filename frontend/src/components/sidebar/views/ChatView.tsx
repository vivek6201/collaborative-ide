"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { IChatMessage } from "@/types/app";
import { useApp } from "@/context/appContext";
import { useSocket } from "@/context/socketContext";
import { SocketEvent } from "@/types/socket";

const ChatView = () => {
  const [inputValue, setInputValue] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(56); // Default height
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const maxTextareaHeight = 200;
  const { messages, setMessages } = useApp();
  const { currentUserData, users } = useApp();
  const user = users.find((u) => u.username === currentUserData?.username);
  const socket = useSocket();

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const isSameUser = (message: IChatMessage) => {
    return message.from.socketId === user?.socketId;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    const newMessage: IChatMessage = {
      from: user,
      message: {
        text: inputValue,
        timestamp: new Date(),
      },
    };

    socket?.sendMessage({
      type: SocketEvent.SEND_MESSAGE,
      data: {
        roomId: user.roomId,
        messageData: newMessage,
      },
    });

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
    setTextareaHeight(56); // Reset to default height
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Reset height to auto to get the correct scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      // Calculate new height (capped at maxTextareaHeight)
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        maxTextareaHeight
      );
      setTextareaHeight(newHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full mx-auto shadow-md bg-background">
      <div
        ref={chatListRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          minHeight: "100px",
          maxHeight: `calc(100% - 56px - ${textareaHeight}px)`, // Adjust based on textarea height
        }}
      >
        {messages.map((message) => (
          <div
            key={message.message.timestamp.toString()}
            className={`flex ${
              isSameUser(message) ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                isSameUser(message) ? "flex-row-reverse" : ""
              }`}
            >
              <div className="h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div
                  className={`p-3 rounded-lg ${
                    isSameUser(message)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.message.text}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTime(new Date(message.message.timestamp))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat input - this will grow upwards */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="pr-10 resize-none"
            style={{
              height: `${textareaHeight}px`,
              maxHeight: `${maxTextareaHeight}px`,
              overflowY:
                textareaHeight >= maxTextareaHeight ? "auto" : "hidden",
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 cursor-pointer"
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
