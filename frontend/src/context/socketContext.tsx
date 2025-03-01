"use client";
import { SOCKET_URL } from "@/lib/constants";
import { SocketEvent, SocketMessageType } from "@/types/socket";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useApp } from "./appContext";
import { RemoteUser, User, USER_STATUS } from "@/types/user";
import { toast } from "sonner";
import useLocalStorage from "@/hooks/useLocalStorage";
import { IChatMessage } from "@/types/app";

interface ISocket {
  ws: WebSocket | null;
  sendMessage: (message: SocketMessageType) => void;
}

const SocketContext = createContext<ISocket | null>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const initialized = useRef<boolean>(false);
  const { setValue } = useLocalStorage();
  const {
    setUserStatus,
    setUsers,
    setCurrentUserData,
    users,
    setMessages,
  } = useApp();

  const handleUserAccepted = useCallback(
    ({ user, users }: { user: User; users: RemoteUser[] }) => {
      setCurrentUserData(user);
      setUsers(users);
      setUserStatus(USER_STATUS.JOINED);
      setValue("user", user);
      toast.success("Room Joined");
    },
    [setUserStatus, setUsers, setCurrentUserData]
  );

  //not working
  const handleUserDisconnected = useCallback(
    ({ user }: { user: RemoteUser }) => {
      toast.success(`${user.username} left the room`);
      setUsers((prevUsers) =>
        prevUsers.filter((it) => it.socketId !== user.socketId)
      );
    },
    [setUsers]
  );

  const handleUserJoined = useCallback(
    ({ user }: { user: RemoteUser }) => {
      toast.success(`${user.username} joined the room`);
      setUsers((users) => [...users, user]);
    },
    [setUsers]
  );

  const handleReceiveMessage = useCallback(
    (message: IChatMessage) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  const handleMessage = (event: MessageEvent) => {
    const message: SocketMessageType = JSON.parse(event.data);

    switch (message.type) {
      case SocketEvent.JOIN_ACCEPTED:
        handleUserAccepted(message.data);
        break;
      case SocketEvent.USER_DISCONNECTED:
        handleUserDisconnected(message.data);
        break;
      case SocketEvent.USER_JOINED:
        handleUserJoined(message.data);
        break;
      case SocketEvent.RECEIVE_MESSAGE:
        handleReceiveMessage(message.data);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const ws = new WebSocket(SOCKET_URL as string);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      wsRef.current = ws;
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.close();
      initialized.current = false;
    };
  }, []);

  function sendMessage(message: SocketMessageType) {
    if (users.length >= 0 || wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(JSON.stringify(message));
    } else {
      console.error(
        "WebSocket is not open. Ready state is:",
        wsRef.current?.readyState
      );
    }
  }

  return (
    <SocketContext.Provider value={{ ws: wsRef.current, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) return null;

  return socket;
};
