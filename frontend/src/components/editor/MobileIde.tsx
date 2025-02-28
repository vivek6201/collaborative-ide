"use client";

import useResponsive from "@/hooks/useResponsive";
import React from "react";
import Navigator from "../sidebar/Navigator";
import CodeEditor from "./CodeEditor";
import Sidebar from "../sidebar";
import { useApp } from "@/context/appContext";

export default function MobileIde() {
  const { isSidebar } = useApp();
  return (
    <div className={`grid grid-rows-[1fr_50px] h-full`}>
      <div className="w-full h-full relative overflow-hidden">
        {isSidebar ? (
          <Sidebar />
        ) : (
          <div className="h-full w-full overflow-hidden">
            <CodeEditor />
          </div>
        )}
      </div>
      <div className="h-full w-full">
        <Navigator />
      </div>
    </div>
  );
}
