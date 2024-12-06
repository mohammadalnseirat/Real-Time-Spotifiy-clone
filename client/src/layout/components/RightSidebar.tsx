import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChatStore from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Headphones, Music, Users } from "lucide-react";
import { useEffect } from "react";

const RightSidebar = () => {
  const { user } = useUser(); // get the current user from clerk
  const { fetchUsers, users, onlineUsers, userActivities } = useChatStore();

  //! useEffect To Run The Function:
  useEffect(() => {
    if (user) fetchUsers();
  }, [user, fetchUsers]);
  return (
    <div className="h-full bg=zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0 text-emerald-500" />
          <h2 className="font-semibold text-gray-50">
            What they're listening to :
          </h2>
        </div>
      </div>

      {!user && <LoginPrompt />}
      {/* ScrollArea */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {users.map((user) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== "Idle";
            return (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-zinc-700 p-3 rounded-md transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-zinc-900 rounded-full ${
                        onlineUsers.has(user.clerkId)
                          ? "bg-green-500 "
                          : "bg-zinc-500"
                      }`}
                      araia-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-50">
                        {user.fullName}
                      </span>
                      {isPlaying && (
                        <Music className="size-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    {isPlaying ? (
                      <div className="mt-1">
                        <div className="text-xs text-gray-100 font-medium truncate">
                          {activity.replace("Playing", "").split("by")[0]}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {activity.split("by")[1]}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-gray-200 uppercase">
                        Idle
                      </div>
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

export default RightSidebar;

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
    <div className="relative">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
        opacity-75 animate-pulse"
        aria-hidden="true"
      />
      <div className="relative bg-zinc-800 rounded-full p-4">
        <Headphones className="size-10 text-emerald-500" />
      </div>
    </div>
    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-semibold text-gray-50">
        See What Friends Are Playing
      </h3>
      <p className="text-sm text-emerald-500 capitalize">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
