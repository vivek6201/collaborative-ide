"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Navigator from "../sidebar/Navigator";
import CodeEditor from "./CodeEditor";
import Sidebar from "../sidebar";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/appContext";
import { toast } from "sonner";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import MobileIde from "./MobileIde";

const Ide = () => {
  const { currentUserData, isSidebar } = useApp();
  const router = useRouter();
  const { isMobile } = useWindowDimensions();

  React.useEffect(() => {
    if (!currentUserData) {
      router.replace("/");
      toast.error("Username is required!");
    }
  }, [currentUserData, router]);

  if (isMobile) {
    return <MobileIde />;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full overflow-hidden"
    >
      <ResizablePanel
        minSize={20}
        defaultSize={20}
        className="flex min-w-[300px]"
      >
        <Navigator />
        {isSidebar ? <Sidebar /> : null}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={50} defaultSize={80} className="w-full h-full">
        <div className="w-full h-full">
          <CodeEditor />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Ide;
