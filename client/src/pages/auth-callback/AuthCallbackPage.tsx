import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const nevigate = useNavigate();

  //! use Ref to prevent render twice:
  const syncAttempt = useRef(false);

  // ? useEffect for fetch the data from the end point:
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempt.current) return;
      try {
        syncAttempt.current = true;
        await axiosInstance.post("/v1/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.log("Error in auth callback", error);
      } finally {
        nevigate("/");
      }
    };
    syncUser();
  }, [isLoaded, nevigate, user]);
  return (
    <div className="h-screen flex items-center justify-center w-full bg-black">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-emerald-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="animate-spin text-emerald-600" />
          <h3 className="capitalize font-bold text-zinc-400 text-xl">
            Logging you in
          </h3>
          <p className="text-emerald-500 font-medium">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;


/* here we use useRef hook to prevent render twice */
