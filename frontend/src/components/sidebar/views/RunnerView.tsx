"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { Copy, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, copyContent } from "@/lib/utils";
import { useApp } from "@/context/appContext";
import { toast } from "sonner";
import runCodeAction from "@/actions/code-runner";

const RunnerView = () => {
  const { activeTab, setActiveTab } = useApp();
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (!activeTab) return;
    try {
      setLoading(true);
      const { data, success } = await runCodeAction(activeTab);
      setActiveTab((prev) => (prev ? { ...prev, output: data } : prev));
      if (success) {
        toast.success("Code Executed Successfully");
      } else {
        toast.error("Code Execution Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to run code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-5 p-2 overflow-y-auto w-full h-full">
      <Select value={activeTab?.language}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="c">C</SelectItem>
          <SelectItem value="cpp">Cpp</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="ts">Typescript</SelectItem>
          <SelectItem value="js">Javascript</SelectItem>
        </SelectContent>
      </Select>
      <ActionArea name="Input" content={activeTab?.input ?? ""} />
      <Button onClick={runCode} disabled={loading}>
        {loading ? <Icon name={Loader} className="animate-spin" /> : null}
        <span>Run</span>
      </Button>
      <ActionArea
        name="Output"
        content={activeTab?.output?.stdout ?? ""}
        readonly={true}
      />
    </div>
  );
};

function ActionArea({
  name,
  content,
  readonly = false,
}: {
  name: string;
  content: string;
  readonly?: boolean;
}) {
  const { setActiveTab } = useApp();

  return (
    <div className="rounded-md border ">
      <div className="w-full py-2 flex justify-between items-center px-4">
        <p className="uppercase font-bold">{name}</p>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => copyContent(content)}
        >
          <Icon name={Copy} />
        </Button>
      </div>
      <textarea
        className={cn(
          "min-h-[200px] border-none outline-none w-full resize-none bg-transparent px-4",
          readonly ? "cursor-default" : ""
        )}
        value={content}
        readOnly={readonly}
        onChange={(e) => {
          setActiveTab((prev) =>
            prev ? { ...prev, input: e.target.value } : prev
          );
        }}
      />
    </div>
  );
}

export default RunnerView;
