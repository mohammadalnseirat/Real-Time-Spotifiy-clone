import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useChatStore from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Loader, Send } from "lucide-react";
import { useState } from "react";
import notificationsound from '@/assets/sounds/notification.mp3'

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser(); // get the current user from clerk
  const { sendMessage, selectedUser, isLoading } = useChatStore();
 

  // handle Send Message:
  const handleSendMessage = () => {
    if (!selectedUser || !user || !newMessage) return;
    sendMessage(selectedUser?.clerkId, user.id, newMessage.trim());
    const sound = new Audio(notificationsound)
    sound.play()
    setNewMessage(""); // clear the input field after sending message
    
  };
  return (
    <div className="mt-auto p-4 border-t border-emerald-900">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="bg-zinc-800 border border-emerald-900"
        />
        <Button
          size={"icon"}
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isLoading}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 text-gray-100 animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-gray-100" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
