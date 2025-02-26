import { useApp } from "@/context/appContext";
import { useSocket } from "@/context/socketContext";
import { SocketEvent, SocketMessageType } from "@/types/socket";
import { RemoteUser } from "@/types/user";
import { act, useCallback, useEffect } from "react";

const useUserActivity = () => {
  const socket = useSocket();
  const { setUsers, activeTab, setActiveTab } = useApp();

  const handleUserTyping = useCallback(
    ({ user }: { user: RemoteUser }) => {
      setUsers((users) => {
        return users.map((u) => {
          if (u.socketId === user.socketId) {
            return user;
          }
          return u;
        });
      });
    },
    [setUsers]
  );

  const handleFileUpdate = useCallback(
    ({ fileId, newContent }: { fileId: string; newContent: string }) => {
      if (activeTab?.id === fileId) {
        setActiveTab((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            content: newContent,
            id: prev.id,
            name: prev.name,
            language: prev.language,
            input: prev.input,
            output: prev.output,
          };
        });
      }
    },
    [activeTab]
  );

  const handleMessage = (event: MessageEvent) => {
    const message: SocketMessageType = JSON.parse(event.data);
    switch (message.type) {
      case SocketEvent.TYPING_START:
        handleUserTyping(message.data);
        break;
      case SocketEvent.TYPING_END:
        handleUserTyping(message.data);
        break;
      case SocketEvent.FILE_UPDATED:
        handleFileUpdate(message.data);
        break;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.ws?.addEventListener("message", handleMessage);

    return () => {
      socket.ws?.removeEventListener("message", handleMessage);
    };
  }, [socket, setUsers]);

  return {};
};

export default useUserActivity;
