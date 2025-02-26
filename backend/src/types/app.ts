export enum SocketEvent {
  JOIN_REQUEST = "join-request",
  JOIN_ACCEPTED = "join-accepted",
  USER_JOINED = "user-joined",
  USER_DISCONNECTED = "user-disconnected",
  SYNC_FILE_STRUCTURE = "sync-file-structure",
  NODE_RENAMED = "node-renamed",
  NODE_DELETED = "node-deleted",
  NODE_CREATED = "node-created",
  FILE_UPDATED = "file-updated",
  USER_OFFLINE = "offline",
  USER_ONLINE = "online",
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message",
  TYPING_START = "typing-start",
  TYPING_END = "typing-end",
  USERNAME_EXISTS = "username-exists",
  USER_LEFT = "user-left",
}

export interface SocketMessageType {
  type: SocketEvent;
  data: any;
}
