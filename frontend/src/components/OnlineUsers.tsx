import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";

export const OnlineUsers = () => {
  const { onlineUsers, connect, disconnect, isConnected } = useSocketStore();
  const { userId } = useAuth();

  useEffect(() => {
    console.log("OnlineUsers component mounted with userId:", userId);
    connect();
    return () => {
      console.log("OnlineUsers component unmounted");
      disconnect();
    };
  }, [connect, disconnect, userId]);

  console.log(
    "OnlineUsers render - isConnected:",
    isConnected,
    "currentUserId:",
    userId,
    "users:",
    onlineUsers
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Online Users ({onlineUsers.length})
          {!isConnected && (
            <span className="text-red-500 ml-2">(Disconnected)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {onlineUsers.length === 0 ? (
            <p className="text-muted-foreground">No users online</p>
          ) : (
            onlineUsers.map((user) => (
              <div key={user.userId} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">
                    {user.username}
                    {user.userId === userId && (
                      <span className="text-blue-500 ml-2">(You)</span>
                    )}
                  </p>
                  {user.currentSong ? (
                    <p className="text-sm text-muted-foreground">
                      Listening to: {user.currentSong.title} -{" "}
                      {user.currentSong.artist}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not playing anything
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
