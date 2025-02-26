"use client";

import AppProvider from "@/context/appContext";
import FileContextProvider from "@/context/fileContext";
import SocketProvider from "@/context/socketContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isClient, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!isClient) return null;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AppProvider>
        <SocketProvider>
          <FileContextProvider>{children}</FileContextProvider>
        </SocketProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default Provider;
