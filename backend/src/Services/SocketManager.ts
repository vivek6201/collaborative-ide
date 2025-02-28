import { RawData, WebSocket, WebSocketServer } from "ws";
import { CONNECTION_STATUS, RemoteUser } from "../types/user";
import { SocketEvent, SocketMessageType } from "../types/app";
import { v4 as uuid } from "uuid";
import { FileManager, type FileNodeType } from "./FileManager";

interface CustomWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
}

interface RoomType {
  users: RemoteUser[];
  fileManager: FileManager;
  files: FileNodeType;
}

export default class SocketManager {
  private static _instance: SocketManager;
  private rooms: Map<string, RoomType>;
  private wss: WebSocketServer;

  private constructor() {
    this.rooms = new Map<string, RoomType>();
    this.wss = this.initializeServer();
    console.log("Server Started");
    this.handleConnection();
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new SocketManager();
    }

    return this._instance;
  }

  private initializeServer() {
    return new WebSocketServer({ port: 4001 });
  }

  private handleConnection() {
    this.wss.on("connection", (ws: CustomWebSocket, req) => {
      console.log("Connection Established!");
      ws.id = uuid();
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (data: RawData) => {
        const message: SocketMessageType = JSON.parse(data.toString());
        this.performActions(ws, message);
      });

      const interval = setInterval(() => {
        if (!ws.isAlive) {
          console.log("Connection lost, terminating...");
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      }, 30000);

      ws.on("close", () => clearInterval(interval));
    });
  }

  private broadcastMessage(
    roomId: string,
    message: SocketMessageType,
    senderWs: CustomWebSocket
  ) {
    const users = this.rooms.get(roomId)?.users ?? [];
    users.forEach((user) => {
      if (user.socketId !== senderWs.id) {
        const client = Array.from(this.wss.clients).find(
          (ws) => (ws as CustomWebSocket).id === user.socketId
        ) as CustomWebSocket;
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      }
    });
  }

  private sendMessage(ws: CustomWebSocket, message: SocketMessageType) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private getUserBySocketId(socketId: string, users: RemoteUser[]) {
    return users.find((user) => user.socketId === socketId) ?? null;
  }

  private performActions(ws: CustomWebSocket, message: SocketMessageType) {
    const type = message.type;
    const data = message.data;

    switch (type) {
      case SocketEvent.JOIN_REQUEST:
        this.handleJoinRequest(ws, data);
        break;
      case SocketEvent.REJOIN_REQUEST:
        this.handleRejoin(ws, data);
        break;
      case SocketEvent.USER_LEFT:
        this.handleUserDisconnected(ws, data);
        break;
      case SocketEvent.SYNC_FILE_STRUCTURE:
        this.handleSyncFileStructure(ws, data);
        break;
      case SocketEvent.NODE_RENAMED:
        this.handleNodeRenamed(ws, data);
        break;
      case SocketEvent.NODE_DELETED:
        this.handleNodeDeleted(ws, data);
        break;
      case SocketEvent.NODE_CREATED:
        this.handleNodeCreated(ws, data);
        break;
      case SocketEvent.FILE_UPDATED:
        this.handleFileUpdated(ws, data);
        break;
      case SocketEvent.USER_OFFLINE:
        this.handleUserOffline(ws, data);
        break;
      case SocketEvent.USER_ONLINE:
        this.handleUserOnline(ws, data);
        break;
      case SocketEvent.SEND_MESSAGE:
        this.handleSendMessage(ws, data);
        break;
      case SocketEvent.RECEIVE_MESSAGE:
        this.handleReceiveMessage(ws, data);
        break;
      case SocketEvent.TYPING_START:
        this.handleTypingStart(ws, data);
        break;
      case SocketEvent.TYPING_END:
        this.handleTypingEnd(ws, data);
        break;
      default:
        console.warn(`Unhandled socket event: ${type}`);
        break;
    }
  }

  private handleRejoin(ws: CustomWebSocket, data: { user: RemoteUser }) {
    const { user } = data;
    const room = this.rooms.get(user.roomId);

    //if room not found return;
    if (!room) return;

    //this ensures it removes the user if already exists and pushes it again
    room?.users.filter((u) => u.socketId !== user.socketId).push(user);
    this.rooms.set(user.roomId, room);

    this.broadcastMessage(
      user.roomId,
      {
        type: SocketEvent.JOIN_ACCEPTED,
        data: {
          user,
          users: room.users,
        },
      },
      ws
    );
  }

  private handleJoinRequest(ws: CustomWebSocket, data: any) {
    const roomId: string = data.roomId;
    const userName: string = data.userName;

    let room = this.rooms.get(roomId);

    if (!room) {
      const fileManager = new FileManager();
      room = {
        users: [],
        fileManager,
        files: fileManager.getFileStructure()!,
      };
      this.rooms.set(roomId, room);
    }

    const user: RemoteUser = {
      username: userName,
      roomId,
      socketId: ws.id,
      cursorPosition: 0,
      status: CONNECTION_STATUS.ONLINE,
      typing: false,
    };
    room.users.push(user);

    this.sendMessage(ws, {
      type: SocketEvent.JOIN_ACCEPTED,
      data: {
        user,
        users: room.users,
      },
    });
    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.USER_JOINED,
        data: { user },
      },
      ws
    );
  }

  private handleUserDisconnected(ws: CustomWebSocket, data: any) {
    const roomId = data.roomId;
    const user: RemoteUser = data.user;
    const room = this.rooms.get(roomId);
    const users = room
      ? room.users.filter((item) => item.socketId !== user.socketId)
      : [];

    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.USER_DISCONNECTED,
        data: { user },
      },
      ws
    );
    if (room) {
      this.rooms.set(roomId, {
        ...room,
        users: users,
        fileManager: room.fileManager,
      });
    }
  }

  private handleSyncFileStructure(
    ws: CustomWebSocket,
    data: { roomId: string }
  ) {
    const room = this.rooms.get(data.roomId);

    this.sendMessage(ws, {
      type: SocketEvent.SYNC_FILE_STRUCTURE,
      data: {
        files: room?.files,
      },
    });
  }

  private handleNodeRenamed(ws: CustomWebSocket, data: any) {
    const { roomId, nodeId, name } = data;
    const room = this.rooms.get(roomId);
    const fileManager = room?.fileManager;

    fileManager?.editNode(nodeId, {
      name: name,
    });

    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.SYNC_FILE_STRUCTURE,
        data: {
          files: room?.files,
        },
      },
      ws
    );
  }

  private handleNodeDeleted(ws: CustomWebSocket, data: any) {
    const { roomId, nodeId } = data;
    let room = this.rooms.get(roomId);
    const fileManager = room?.fileManager;

    fileManager?.deleteNode(nodeId);

    if (fileManager && room) {
      room = {
        ...room,
        files: fileManager.getFileStructure()!,
      };
      this.rooms.set(roomId, room);
    }

    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.SYNC_FILE_STRUCTURE,
        data: {
          files: room?.files,
        },
      },
      ws
    );
  }

  private handleNodeCreated(ws: CustomWebSocket, data: any) {
    const { roomId, nodeData } = data;
    const { name, parentId, type } = nodeData;

    const room = this.rooms.get(roomId);
    const fileManager = room?.fileManager;

    const newNode = fileManager?.addChildNode(parentId, name, type);
    this.sendMessage(ws, {
      type: SocketEvent.NODE_CREATED,
      data: {
        parentId,
        node: newNode,
      },
    });
    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.NODE_CREATED,
        data: {
          parentId,
          node: newNode,
        },
      },
      ws
    );
  }

  private handleFileUpdated(ws: CustomWebSocket, data: any) {
    const { roomId, newContent, fileId } = data;
    const room = this.rooms.get(roomId);
    const files = room?.files;

    const updateFileContent = (files: FileNodeType | undefined) => {
      if (!files) return;

      files.children?.forEach((file) => {
        if (file.id === fileId) {
          file.content = newContent;
        }
        updateFileContent(file);
      });
    };

    updateFileContent(files);

    this.broadcastMessage(
      roomId,
      {
        type: SocketEvent.FILE_UPDATED,
        data: {
          fileId: fileId,
          newContent: newContent,
        },
      },
      ws
    );
  }

  private handleUserOffline(ws: CustomWebSocket, data: any) {
    // Handle user offline logic
  }

  private handleUserOnline(ws: CustomWebSocket, data: any) {
    // Handle user online logic
  }

  private handleSendMessage(ws: CustomWebSocket, data: any) {
    // Handle send message logic
  }

  private handleReceiveMessage(ws: CustomWebSocket, data: any) {
    // Handle receive message logic
  }

  private handleTypingStart(
    ws: CustomWebSocket,
    data: { roomId: string; cursorPosition: number }
  ) {
    const room = this.rooms.get(data.roomId);

    room?.users.forEach((user) => {
      if (user.socketId === ws.id) {
        user.typing = true;
        user.cursorPosition = data.cursorPosition;
      }
    });

    if (!room?.users) return;

    const user = this.getUserBySocketId(ws.id, room?.users);

    this.broadcastMessage(
      data.roomId,
      {
        type: SocketEvent.TYPING_START,
        data: { user },
      },
      ws
    );
  }

  private handleTypingEnd(ws: CustomWebSocket, data: { roomId: string }) {
    const room = this.rooms.get(data.roomId);
    const users = room?.users;

    users?.forEach((user) => {
      if (user.socketId === ws.id) {
        user.typing = false;
      }
    });

    if (!users) return;

    const user = this.getUserBySocketId(ws.id, users);

    this.broadcastMessage(
      data.roomId,
      {
        type: SocketEvent.TYPING_END,
        data: { user },
      },
      ws
    );
  }
}
