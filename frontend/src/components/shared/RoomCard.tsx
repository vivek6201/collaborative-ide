"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, KeyRound, Sparkles, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Icon } from "../ui/icon";
import { useSocket } from "@/context/socketContext";
import { useApp } from "@/context/appContext";
import { SocketEvent } from "@/types/socket";
import { toast } from "sonner";

const RoomCard = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const socket = useSocket();

  const generateRoomId = () => {
    setIsGenerating(true);
    // Generate a random 6-character room ID
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!socket) return;
    e.preventDefault();
    setLoading(true);
    try {
      socket.sendMessage({
        type: SocketEvent.JOIN_REQUEST,
        data: {
          roomId,
          userName: username,
        },
      });
      router.push(`/room?id=${roomId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to join Room!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md relative backdrop-blur-sm bg-background/90 shadow-xl border border-primary/20">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          CodersHub
        </CardTitle>
        <CardDescription className="text-center">
          A Collaborative ide for developers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2 ">
              <Icon name={Users} />
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-2 focus:border-primary/50 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomId" className="flex items-center gap-2">
              <Icon name={KeyRound} />
              Room ID
            </Label>
            <div className="flex gap-2">
              <Input
                id="roomId"
                placeholder="Enter or generate room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                required
                className="flex-1 border-2 focus:border-primary/50 focus:ring-primary/50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateRoomId}
                className={`shrink-0 hover:bg-primary hover:text-primary-foreground ${
                  isGenerating ? "animate-pulse" : ""
                }`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/80"
          >
            {loading ? <Loader /> : null}
            Join Room
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
