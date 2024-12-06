import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 mb-8">
        <Link to={"/"} className="rounded-lg">
          <img
            src="/spotify.png"
            alt="image-logo"
            className="size-10 text-black"
          />
        </Link>
        <div>
          <h1 className="capitalize text-3xl font-bold text-emerald-500">
            music manager
          </h1>
          <p className="text-zinc-400 mt-1 capitalize italic">manage your music catalog</p>
        </div>
      </div>
      <UserButton />
    </div>
  );
};

export default Header;
