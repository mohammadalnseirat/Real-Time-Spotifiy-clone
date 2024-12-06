import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import useChatStore from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

//! Function To Update Api Token:
const updateApiToken = (token: string | null) => {
  if (token)
    // update axiosInstance:
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        // ? update api token:
        updateApiToken(token);
        //! if user authenticated, and there is a token available check for the admin:
        if (token) {
          await checkAdminStatus();
          if (userId) initSocket(userId);
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Error updating api token", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();

    // ? clean up the socket when close the browser:
    return () => {
      disconnectSocket();
    };
  }, [getToken, checkAdminStatus, userId, initSocket, disconnectSocket]);

  // ? if there is loading:
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-9 animate-spin text-emerald-600" />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AuthProvider;
