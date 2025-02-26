import { useApp } from "@/context/appContext";
import React from "react";
import ClientView from "./views/ClientView";
import ChatView from "./views/ChatView";
import RunnerView from "./views/RunnerView";
import FileManagerView from "./views/FileManagerView";
import SettingView from "./views/SettingView";

const Sidebar = () => {
  const { currSideView } = useApp();

  const renderView = () => {
    switch (currSideView.name) {
      case "File Manager":
        return <FileManagerView />;
      case "Chat":
        return <ChatView />;
      case "Run":
        return <RunnerView />;
      case "Settings":
        return <SettingView />;
      case "Users":
        return <ClientView />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full border-b border-gray-300 dark:border-gray-800 px-2 py-1">
        <p className="uppercase font-bold text-sm opacity-70">
          {currSideView.name}
        </p>
      </div>

      {renderView()}
    </div>
  );
};

export default Sidebar;
