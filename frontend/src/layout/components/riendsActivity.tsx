import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) fetchUsers();
  }, [fetchUsers, isSignedIn]);

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">What they're listening to</h2>
        </div>
      </div>

      {!isSignedIn && <LoginPrompt />}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== "Idle";

            return (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-10 border border-zinc-800">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${
                        onlineUsers.has(user.clerkId)
                          ? "bg-green-500"
                          : "bg-zinc-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.fullName}</p>
                    {isPlaying ? (
                      <p className="text-sm text-zinc-400 flex items-center gap-1">
                        <HeadphonesIcon className="size-4" />
                        {activity}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-400">Idle</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

const LoginPrompt = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center space-y-2">
      <Music className="size-8 mx-auto text-zinc-400" />
      <p className="text-zinc-400">
        Sign in to see what your friends are listening to
      </p>
    </div>
  </div>
);

export default FriendsActivity;
