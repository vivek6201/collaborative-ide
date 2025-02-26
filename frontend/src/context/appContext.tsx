"use client";

import { Tabs as View } from "@/lib/constants";
import { IApp, ITab } from "@/types/app";
import { CONNECTION_STATUS, RemoteUser, User, USER_STATUS } from "@/types/user";
import { createContext, useContext, useState } from "react";

const AppContext = createContext<IApp | null>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<RemoteUser[]>([]);
  const [userStatus, setUserStatus] = useState<USER_STATUS>(
    USER_STATUS.INITIAL
  );
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [currSideView, setCurrSideView] = useState(View[0]);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [activeTab, setActiveTab] = useState<ITab | null>(null);

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        userStatus,
        setUserStatus,
        currentUserData,
        setCurrentUserData,
        currSideView,
        setCurrSideView,
        tabs,
        setTabs,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useApp = () => {
  const appContext = useContext(AppContext);

  if (!appContext)
    throw new Error("AppProvider must be wrapped around the root");

  return appContext;
};
