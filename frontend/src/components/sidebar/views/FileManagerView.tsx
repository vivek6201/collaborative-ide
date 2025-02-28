import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { File, FilePlus, Folder, FolderOpen, FolderPlus } from "lucide-react";
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useApp } from "@/context/appContext";
import { IOutput } from "@/types/app";
import { cn } from "@/lib/utils";
import { useSocket } from "@/context/socketContext";
import { useFileTree } from "@/context/fileContext";
import { SocketEvent } from "@/types/socket";
import { FileNode } from "@/types/file";

const FileManagerView = () => {
  const { currentUserData } = useApp();
  const { fileTree } = useFileTree();
  const socket = useSocket();

  const handleAddNode = (id: string, type: "FILE" | "FOLDER") => {
    const userInput = prompt(`Enter ${type} Name`);
    if (!userInput) return;
    socket?.sendMessage({
      type: SocketEvent.NODE_CREATED,
      data: {
        roomId: currentUserData?.roomId,
        nodeData: {
          name: userInput,
          parentId: id,
          type: type,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="py-1 px-2 flex items-center justify-between">
        <p className="text-sm font-bold uppercase opacity-65">Root</p>
        <div className="flex gap-2 items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-7 h-7"
            onClick={() => fileTree && handleAddNode(fileTree.id, "FILE")}
          >
            <FilePlus />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-7 h-7"
            onClick={() => fileTree && handleAddNode(fileTree.id, "FOLDER")}
          >
            <FolderPlus />
          </Button>
        </div>
      </div>
      <div className="pl-2">
        {fileTree?.children?.map((item) => (
          <TreeNode key={item.id} node={item} handleAddNode={handleAddNode} />
        ))}
      </div>
    </div>
  );
};

function TreeNode({
  node,
  handleAddNode,
}: {
  node: FileNode;
  handleAddNode: (id: string, type: "FILE" | "FOLDER") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { setTabs, setActiveTab, activeTab, currentUserData } = useApp();
  const socket = useSocket();

  const pushToTabs = () => {
    if (node.type === "FOLDER") return;

    const ext = node.name.split(".").pop() || "";

    const newTab = {
      id: node.id,
      input: "",
      name: node.name,
      language: ext,
      output: {} as IOutput,
      content: node.content ?? "",
    };

    setTabs((prev) => {
      if (prev.some((tab) => tab.id === node.id)) {
        return prev;
      }
      return [...prev, newTab];
    });
    setActiveTab(newTab);
  };

  const handleDeleteNode = () => {
    socket?.sendMessage({
      type: SocketEvent.NODE_DELETED,
      data: {
        roomId: currentUserData?.roomId,
        nodeId: node.id,
      },
    });
    socket?.sendMessage({
      type: SocketEvent.SYNC_FILE_STRUCTURE,
      data: {
        roomId: currentUserData?.roomId,
      },
    });
  };

  const handleRenameNode = () => {
    const userInput = prompt("Enter name");
    if (!userInput) return;
    socket?.sendMessage({
      type: SocketEvent.NODE_RENAMED,
      data: {
        roomId: currentUserData?.roomId,
        name: userInput,
        nodeId: node.id,
      },
    });
    socket?.sendMessage({
      type: SocketEvent.SYNC_FILE_STRUCTURE,
      data: {
        roomId: currentUserData?.roomId,
      },
    });
  };

  return (
    <div className="" key={node.id}>
      {node.type === "FOLDER" ? (
        <div>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className="flex gap-2 items-center hover:dark:bg-gray-900 cursor-pointer py-1"
                onClick={() => setExpanded(!expanded)}
              >
                <Icon name={expanded ? FolderOpen : Folder} />
                <span>{node.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleAddNode(node.id, "FILE")}>
                <span className="font-bold uppercase">ADD FILE</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleAddNode(node.id, "FOLDER")}>
                <span className="font-bold uppercase">ADD FOLDER</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={handleRenameNode}>
                <span className="font-bold uppercase">RENAME</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={handleDeleteNode}>
                <span className="font-bold uppercase text-red-500">DELETE</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {expanded && (
            <div className="pl-2">
              {node.children?.map((item) => (
                <TreeNode
                  key={item.id}
                  node={item}
                  handleAddNode={handleAddNode}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex gap-2 items-center hover:dark:bg-gray-900 hover:bg-gray-200 cursor-pointer",
                activeTab?.id === node.id ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-700" : ""
              )}
              onClick={pushToTabs}
            >
              <Icon name={File} />
              <span>{node.name}</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleRenameNode}>
              <span className="font-bold uppercase">RENAME</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDeleteNode}>
              <span className="font-bold uppercase text-red-500">DELETE</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </div>
  );
}

export default FileManagerView;
