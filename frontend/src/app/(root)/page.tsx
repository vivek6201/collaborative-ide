import RoomCard from "@/components/shared/RoomCard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full animate-float blur-2xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/5 rounded-full animate-float delay-1000 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full animate-pulse-soft blur-2xl" />
      </div>
      <RoomCard />
    </main>
  );
}
