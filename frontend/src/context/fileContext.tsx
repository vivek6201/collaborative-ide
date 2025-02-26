import { FileNode } from "@/types/file";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "./socketContext";
import { SocketEvent, SocketMessageType } from "@/types/socket";
import { useApp } from "./appContext";

interface IFileContext {
  fileTree: FileNode | null;
  setFileTree: Dispatch<SetStateAction<FileNode | null>>;
}

const FileContext = createContext<IFileContext | null>(null);

const FileContextProvider = ({ children }: { children: ReactNode }) => {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const socket = useSocket();
  const { currentUserData } = useApp();

  const handleFileSync = useCallback(
    ({ files }: { files: FileNode }) => {
      setFileTree(files);
    },
    [setFileTree]
  );

  const handleNodeCreated = useCallback(
    ({ parentId, node }: { parentId: string; node: FileNode }) => {
      setFileTree((prevTree) => {
        if (!prevTree) return null;

        const addNode = (
          tree: FileNode,
          parentId: string,
          newNode: FileNode
        ): FileNode => {
          if (tree.id === parentId) {
            return {
              ...tree,
              children: [...(tree.children || []), newNode],
            };
          }

          return {
            ...tree,
            children: tree.children?.map((child) =>
              addNode(child, parentId, newNode)
            ),
          };
        };

        return addNode(prevTree, parentId, node);
      });
    },
    [setFileTree]
  );

  const handleMessage = (event: MessageEvent) => {
    const message: SocketMessageType = JSON.parse(event.data);
    switch (message.type) {
      case SocketEvent.SYNC_FILE_STRUCTURE:
        handleFileSync(message.data);
        break;
      case SocketEvent.NODE_CREATED:
        handleNodeCreated(message.data);
        break;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.ws?.addEventListener("message", handleMessage);

    socket.sendMessage({
      type: SocketEvent.SYNC_FILE_STRUCTURE,
      data: {
        roomId: currentUserData?.roomId,
      },
    });

    return () => {
      socket.ws?.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <FileContext.Provider value={{ fileTree, setFileTree }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContextProvider;

export const useFileTree = () => {
  const context = useContext(FileContext);

  if (!context)
    throw new Error("useFileTree should wrapped with FileContextProvider");

  return context;
};
