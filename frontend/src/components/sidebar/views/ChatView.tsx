"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React from "react";

const ChatView = () => {
  return (
    <div className="grid grid-rows-[95%_1fr] gap-y-2 h-[calc(100%-1.8rem)] p-2">
      <div className="border rounded-md bg-gray-800 ">
        
      </div>
      <div className="flex gap-2 items-center h-full">
        <Input placeholder="Type a message" />
        <Button className="bg-green-700 w-9 h-9">
          <Icon name={Send} className="text-white w-10 " />
        </Button>
      </div>
    </div>
  );
};

export default ChatView;
