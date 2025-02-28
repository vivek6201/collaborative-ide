import { TabItem } from "@/lib/constants";
import { RemoteUser, User, USER_STATUS } from "./user";

export interface IApp {
  users: RemoteUser[];
  setUsers: React.Dispatch<React.SetStateAction<RemoteUser[]>>;
  userStatus: USER_STATUS;
  setUserStatus: React.Dispatch<React.SetStateAction<USER_STATUS>>;
  currentUserData: User | null;
  setCurrentUserData: React.Dispatch<React.SetStateAction<User | null>>;
  currSideView: TabItem;
  setCurrSideView: React.Dispatch<React.SetStateAction<TabItem>>;
  tabs: ITab[];
  setTabs: React.Dispatch<React.SetStateAction<ITab[]>>;
  activeTab: ITab | null;
  isSidebar: boolean;
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<ITab | null>>;
}

export interface IOutput {
  stdout: string;
  memory: number;
  message: string | null;
  status: {
    description: string;
    id: number;
  };
  stderr: string | null;
  compile_output: null;
  time: number;
  token: string;
}

export interface ITab {
  id: string;
  name: string;
  language: string;
  content: string;
  input: string;
  output: IOutput | null;
}
