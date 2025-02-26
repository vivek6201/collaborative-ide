"use client";
import { Tabs } from "@/lib/constants";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { LucideProps, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useApp } from "@/context/appContext";

const Navigator = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-[60px] h-full border-r border-gray-300 dark:border-gray-800 flex flex-col gap-y-2 py-2 items-center justify-between">
      <div className="flex flex-col gap-y-2">
        {Tabs.map((item, index) => (
          <CustomButton item={item} key={index} />
        ))}
      </div>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
};

export default Navigator;

function CustomButton({
  item,
}: {
  item: {
    name: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  };
}) {
  const { currSideView, setCurrSideView } = useApp();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currSideView.name === item.name ? "secondary" : "ghost"}
            size={"icon"}
            onClick={() => setCurrSideView(item)}
          >
            <Icon name={item.icon} size={22} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
