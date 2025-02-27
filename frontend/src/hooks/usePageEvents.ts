import { useApp } from "@/context/appContext";
import { useSocket } from "@/context/socketContext";
import { SocketEvent } from "@/types/socket";
import { useEffect } from "react";

export default function usePageEvents() {
  const socket = useSocket();
  const { users, currentUserData } = useApp();

  useEffect(() => {
    const handleUserLeft = () => {
      const user = users.find(
        (item) => currentUserData?.username === item.username
      );
      if (user) {
        socket?.sendMessage({
          type: SocketEvent.USER_LEFT,
          data: {
            roomId: currentUserData?.roomId,
            user,
          },
        });
      }
    };

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.returnValue = "Changes you made may not be saved";
      handleUserLeft();
    };

    const handleVisibilityChange = () => {
      if (document.hidden){
        console.log("tab changed");
      };
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
