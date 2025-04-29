import { useChatStore } from "@/stores/useChatStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities, isLoading } =
    useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-4 p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Avatar>
            <AvatarImage src={user.imageUrl} alt={user.fullName} />
            <AvatarFallback>{user.fullName?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.fullName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {userActivities.get(user.clerkId) ||
                (onlineUsers.has(user.clerkId) ? "Online" : "Offline")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsActivity;
