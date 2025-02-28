"use client";
import React, { useEffect, useMemo, useState } from "react";
import CodeMirror, {
  Extension,
  scrollPastEnd,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useApp } from "@/context/appContext";
import { ITab } from "@/types/app";
import { useSocket } from "@/context/socketContext";
import { SocketEvent, SocketMessageType } from "@/types/socket";
import useUserActivity from "@/hooks/useUserActivity";
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { color } from "@uiw/codemirror-extensions-color";
import usePageEvents from "@/hooks/usePageEvents";
import OpenTabs from "./OpenTabs";
import useResponsive from "@/hooks/useResponsive";

const CodeEditor = () => {
  const { theme } = useTheme();
  const { tabs, activeTab, setActiveTab, currentUserData, users } = useApp();
  const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0));
  const socket = useSocket();
  const filteredUsers = useMemo(
    () => users.filter((u) => u.username !== currentUserData?.username),
    [users, currentUserData]
  );
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const { viewHeight } = useResponsive();

  useUserActivity();
  usePageEvents();

  const handleCodeChange = (code: string, view: ViewUpdate) => {
    if (!activeTab) return;

    const file: ITab = { ...activeTab, content: code };
    setActiveTab(file);

    const cursorPosition = view.state?.selection?.main?.head;
    socket?.sendMessage({
      type: SocketEvent.TYPING_START,
      data: { roomId: currentUserData?.roomId, cursorPosition },
    });
    socket?.sendMessage({
      type: SocketEvent.FILE_UPDATED,
      data: {
        roomId: currentUserData?.roomId,
        fileId: activeTab.id,
        newContent: code,
      },
    });
    clearTimeout(timeOut);

    const newTimeOut = setTimeout(
      () =>
        socket?.sendMessage({
          type: SocketEvent.TYPING_END,
          data: { roomId: currentUserData?.roomId },
        }),
      1000
    );
    setTimeOut(newTimeOut);
  };

  useEffect(() => {
    const extensions = [
      color,
      hyperLink,
      tooltipField(filteredUsers),
      cursorTooltipBaseTheme,
      scrollPastEnd(),
    ];

    setExtensions(extensions);
  }, []);

  return (
    <div className={`w-full h-full`}>
      <OpenTabs />

      {tabs.length > 0 ? (
        <div className="w-full h-full">
          <CodeMirror
            className="w-full h-full overflow-y-auto"
            theme={theme === "dark" ? "dark" : "light"}
            value={activeTab?.content}
            onChange={handleCodeChange}
            extensions={extensions}
            maxHeight={`${viewHeight}px`}
          />
        </div>
      ) : (
        <div className="bg-gray-300 dark:bg-gray-800 w-full h-full flex items-center justify-center">
          <p className="uppercase font-bold text-xl">No File Selected</p>
        </div>
      )}
    </div>
  )
};

export default CodeEditor;
