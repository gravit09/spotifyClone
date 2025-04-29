import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
  const {
    users,
    selectedUser,
    isLoading,
    setSelectedUser,
    onlineUsers,
    userActivities,
  } = useChatStore();

  console.log("[UsersList] Users:", users);
  console.log("[UsersList] Number of users:", users.length);
  console.log("[UsersList] Online Users:", Array.from(onlineUsers));
  console.log(
    "[UsersList] User Activities:",
    Array.from(userActivities.entries())
  );
  console.log("[UsersList] Selected User:", selectedUser);

  if (isLoading) {
    return (
      <div className="border-r border-zinc-800">
        <div className="flex flex-col h-full">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-2 p-4">
              <UsersListSkeleton />
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="border-r border-zinc-800">
        <div className="flex flex-col h-full">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 text-center text-zinc-400">No users found</div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="border-r border-zinc-800">
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-4">
            {users.map((user) => {
              const isOnline = onlineUsers.has(user.clerkId);
              const activity = userActivities.get(user.clerkId);
              console.log(
                `[UsersList] User ${user.fullName} is ${
                  isOnline ? "online" : "offline"
                }`
              );
              return (
                <div
                  key={user.clerkId}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                    selectedUser?.clerkId === user.clerkId
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-sm text-gray-500">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
