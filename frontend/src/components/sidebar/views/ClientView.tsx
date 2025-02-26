"use client";
import { useApp } from "@/context/appContext";
import { CONNECTION_STATUS, RemoteUser } from "@/types/user";
import React from "react";

const ClientView = () => {
  const { users } = useApp();
  return (
    <div className="flex gap-5 p-5">
      {users.map((user) => (
        <Client user={user} key={user.socketId} />
      ))}
    </div>
  );
};

export default ClientView;

function Client({ user }: { user: RemoteUser }) {
  return (
    <div className="w-[70px] flex flex-col gap-y-2 rounded-md hover:bg-gray-700 p-2 cursor-pointer">
      <div className="relative h-[50px] bg-blue-500 rounded flex items-center justify-center">
        {user.status === CONNECTION_STATUS.ONLINE ? (
          <div className="absolute rounded-full bg-green-600 h-2 w-2 -top-1 -right-1" />
        ) : null}
        <p className="text-xl shadow-md">{user.username.charAt(0)}</p>
      </div>
      <p className="capitalize text-center">{user.username}</p>
    </div>
  );
}
