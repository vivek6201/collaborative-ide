"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CodeMirror, {
  Extension,
  scrollPastEnd,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useApp } from "@/context/appContext";
import { ITab } from "@/types/app";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/socketContext";
import { SocketEvent, SocketMessageType } from "@/types/socket";
import useUserActivity from "@/hooks/useUserActivity";
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { color } from "@uiw/codemirror-extensions-color";
import usePageEvents from "@/hooks/usePageEvents";

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
    <div className="w-full h-full ">
      <div className="flex gap-2 items-center">
        {tabs.map((item) => (
          <Tab data={item} key={item.id} />
        ))}
      </div>
      {tabs.length > 0 ? (
        <CodeMirror
          className="w-full h-full"
          theme={theme === "dark" ? "dark" : "light"}
          minHeight="100%"
          value={activeTab?.content}
          onChange={handleCodeChange}
          extensions={extensions}
        />
      ) : (
        <div className="bg-gray-800 w-full h-full flex items-center justify-center">
          <p className="uppercase font-bold text-xl">No File Selected</p>
        </div>
      )}
    </div>
  );
};

function Tab({ data }: { data: ITab }) {
  const { setTabs, activeTab, setActiveTab } = useApp();

  const removeFromTabs = () => {
    setTabs((tabs) => {
      const newTabs = tabs.filter((item) => item.id !== data.id);
      if (activeTab?.id === data.id) {
        const currentIndex = tabs.findIndex((item) => item.id === data.id);
        const newActiveTab = newTabs[currentIndex - 1] || newTabs[0] || null;
        setActiveTab(newActiveTab);
      }
      return newTabs;
    });
  };

  const changeActiveTab = () => {
    setActiveTab(data);
  };

  return (
    <div
      className={cn(
        "rounded-t-lg px-5 py-3 flex justify-between items-center cursor-pointer relative",
        activeTab?.id === data.id ? "bg-gray-800" : ""
      )}
      onClick={changeActiveTab}
    >
      {activeTab?.id == data.id ? (
        <div className="bg-blue-700 h-[0.2rem] absolute top-0 left-0 right-0" />
      ) : null}
      <p
        className={cn(
          "opacity-70 ",
          activeTab?.id === data.id ? "opacity-100" : ""
        )}
      >
        {data.name}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="w-5 h-5"
        onClick={(e) => {
          e.stopPropagation();
          removeFromTabs();
        }}
      >
        <X />
      </Button>
    </div>
  );
}

export default CodeEditor;
