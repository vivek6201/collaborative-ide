import { v4 as uuid4 } from "uuid";

export type NodeType = "FILE" | "FOLDER";

class FileNode {
  name: string;
  type: NodeType;
  id: string;
  content?: string;
  children?: FileNode[];

  constructor(name: string, type: NodeType) {
    this.name = name;
    this.type = type;
    this.id = uuid4();

    if (this.type === "FOLDER") {
      this.children = [];
    }

    if (this.type === "FILE") {
      this.content = "";
    }
  }

  addChildren(name: string, type: NodeType): FileNode | null {
    if (this.type !== "FOLDER") return null;
    if (!this.children) {
      this.children = [];
    }
    const newNode = new FileNode(name, type);
    this.children.push(newNode);
    return newNode;
  }

  getNodeData() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      children: this.children,
    };
  }

  findNodeById(id: string): FileNode | null {
    if (this.id === id) return this;
    if (this.children) {
      for (const child of this.children) {
        const found = child.findNodeById(id);
        if (found) return found;
      }
    }
    return null;
  }

  deleteChildById(id: string): void {
    if (!this.children) return;
    this.children = this.children.filter((child) => child.id !== id);
    for (const child of this.children) {
      child.deleteChildById(id);
    }
  }

  editNode(
    id: string,
    update: {
      newName?: string;
      content?: string;
    }
  ): void {
    const node = this.findNodeById(id);
    if (node) {
      (node.name = update.newName ? update.newName : node.name),
        (node.content = update.content ? update.content : node.content);
    }
  }
}

export class FileManager {
  private static _instance: FileManager;
  private root: FileNode;

  constructor() {
    this.root = new FileNode("root", "FOLDER");
    this.root.addChildren("index.js", "FILE");
  }

  addChildNode(parentId: string, name: string, type: NodeType) {
    const parentNode = this.root.findNodeById(parentId);
    if (parentNode && parentNode.type === "FOLDER") {
      const node = parentNode.addChildren(name, type);
      return node;
    }
  }

  deleteNode(nodeId: string) {
    this.root.deleteChildById(nodeId);
  }

  editNode(
    nodeId: string,
    update: {
      name?: string;
      content?: string;
    }
  ) {
    this.root.editNode(nodeId, {
      newName: update.name,
      content: update.content,
    });
  }

  getFileStructure(nodeId?: string) {
    if (!nodeId) {
      return this.root.getNodeData();
    }
    const node = this.root.findNodeById(nodeId);
    return node?.getNodeData();
  }
}

export type FileNodeType = Pick<
  FileNode,
  "name" | "type" | "id" | "children" | "content"
>;
