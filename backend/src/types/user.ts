export enum CONNECTION_STATUS {
  ONLINE = "online",
  OFFLINE = "offline",
}

export interface User {
  username: string;
  roomId: string;
}

export interface RemoteUser extends User {
  cursorPosition: number;
  typing: boolean;
  socketId: string;
  status: CONNECTION_STATUS;
}

export enum USER_STATUS {
  INITIAL = "initial",
  CONNECTING = "connecting",
  ATTEMPTING_JOIN = "attempting-join",
  JOINED = "joined",
  CONNECTION_FAILED = "connection-failed",
  DISCONNECTED = "disconnected",
}
