import {
  File,
  LucideProps,
  MessageCircle,
  Play,
  Settings,
  User,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const judgeUrl = process.env.NEXT_PUBLIC_JUDGE_URL;

export interface TabItem {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const Tabs: TabItem[] = [
  {
    name: "File Manager",
    icon: File,
  },
  {
    name: "Chat",
    icon: MessageCircle,
  },
  {
    name: "Run",
    icon: Play,
  },
  {
    name: "Settings",
    icon: Settings,
  },
  {
    name: "Users",
    icon: User,
  },
];
