import Topbar from "@/components/Topbar";
import useChatStore from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UserList from "./components/UserList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import MessageInput from "./components/MessageInput";

// Format time:
const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser(); // get the current user from clerk
  const { fetchUsers, fetchMessages, selectedUser, messages } = useChatStore();
  //? useEffect to fetch users:
  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  //? useEffect to fetch messages for the selected User:
  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  console.log(messages);
  return (
    <main className="h-full rounded-lg border border-emerald-900 bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />
      <div className=" h-[calc(100vh-180px)] grid-cols-[80px_1fr]  grid lg:grid-cols-[300px_1fr] ">
        <UserList />
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />
              {/* Message Section */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?.id ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user?.imageUrl
                              : selectedUser?.imageUrl
                          }
                        />
                      </Avatar>
                      <div
                        className={`shake rounded-lg p-3 max-w-[75%] ${
                          message.senderId === user?.id
                            ? "bg-green-500"
                            : "bg-zinc-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs mt-1 text-zinc-300 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <MessageInput />
            </>
          ) : (
            <NoConversationSelected />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <img
        src="/spotify.png"
        alt="image-logo"
        className="size-16 animate-pulse"
      />
      <div className="text-center">
        <h3 className="text-lg font-medium capitalize text-emerald-500 mb-1">
          No conversation selected
        </h3>
        <p className="text-red-500 italic text-sm">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
};
