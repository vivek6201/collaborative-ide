export type NodeType = "FILE" | "FOLDER";

export interface FileNode {
  name: string;
  type: NodeType;
  id: string;
  content?: string;
  children?: FileNode[];
}
