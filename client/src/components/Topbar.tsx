import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { LayoutDashboardIcon } from "lucide-react";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  return (
    <div className="flex items-center justify-between  p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-lg z-10">
      <div className="flex items-center gap-2 font-bold text-gray-100">
        <img src="/spotify.png" alt="logo" className="size-8" />
        Spotify
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={`capitalize border border-emerald-700 ${cn(
              buttonVariants({ variant: "outline" })
            )}`}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            admin dashboard
          </Link>
        )}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
