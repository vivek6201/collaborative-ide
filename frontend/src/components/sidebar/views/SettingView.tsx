import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import React, { useState } from "react";

const SettingView = () => {
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState(14);
  return (
    <div className="p-5">
      <div className="flex gap-2 flex-col">
        <Label htmlFor="theme">Theme</Label>
        <div className="flex gap-2">
          <Select defaultValue={theme}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Theme" />
            </SelectTrigger>
            <SelectContent className="flex-grow">
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={"14"}
            onValueChange={(value) => setFontSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select a Font Size" />
            </SelectTrigger>
            <SelectContent align="end">
              {Array.from({ length: 19 }, (_, i) => (
                <SelectItem key={i + 14} value={`${i + 14}`}>
                  {i + 14}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SettingView;
