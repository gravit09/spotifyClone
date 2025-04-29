import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useAuth } from "@clerk/clerk-react";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect, disconnect } = useSocketStore();
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      connect(userId);
    }

    return () => {
      disconnect();
    };
  }, [isLoaded, isSignedIn, userId, connect, disconnect]);

  return <>{children}</>;
};
