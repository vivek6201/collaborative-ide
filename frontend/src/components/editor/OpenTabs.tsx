import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/appContext";
import { ITab } from "@/types/app";
import { X } from "lucide-react";

export default function OpenTabs() {
  const { tabs } = useApp();
  return (
    <div className="flex gap-2 items-center">
      {tabs.map((item) => (
        <Tab data={item} key={item.id} />
      ))}
    </div>
  );
}

function Tab({ data }: { data: ITab }) {
  const { setTabs, activeTab, setActiveTab } = useApp();

  const removeFromTabs = () => {
    setTabs((tabs) => {
      const newTabs = tabs.filter((item) => item.id !== data.id);
      if (activeTab?.id === data.id) {
        const currentIndex = tabs.findIndex((item) => item.id === data.id);
        const newActiveTab = newTabs[currentIndex - 1] || newTabs[0] || null;
        setActiveTab(newActiveTab);
      }
      return newTabs;
    });
  };

  const changeActiveTab = () => {
    setActiveTab(data);
  };

  return (
    <div
      className={cn(
        "rounded-t-lg px-5 py-3 flex gap-5 justify-between items-center cursor-pointer relative",
        activeTab?.id === data.id ? "dark:bg-gray-800 bg-gray-300" : ""
      )}
      onClick={changeActiveTab}
    >
      {activeTab?.id == data.id ? (
        <div className="bg-blue-700 h-[0.2rem] absolute top-0 left-0 right-0" />
      ) : null}
      <p
        className={cn(
          "opacity-70 ",
          activeTab?.id === data.id ? "opacity-100" : ""
        )}
      >
        {data.name}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="w-5 h-5 hover:bg-red-400"
        onClick={(e) => {
          e.stopPropagation();
          removeFromTabs();
        }}
      >
        <X />
      </Button>
    </div>
  );
}
