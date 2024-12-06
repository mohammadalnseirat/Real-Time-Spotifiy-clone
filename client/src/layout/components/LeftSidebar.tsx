import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  //! fetch data from the server:
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  //! useEffect To Call the Function:
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);
;
  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation Menu */}
      <div className="bg-zinc-900 p-4 rounded-lg border-emerald-300">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full flex justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="size-6 mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/*If the user is signed in */}
          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full flex justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="size-6 mr-2" />
              <span className="hidden sm:inline">Message</span>
            </Link>
          </SignedIn>
        </div>
      </div>
      {/* Library Section */}
      <div className="flex-1  rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Library className="size-6 mr-2" />
            <span className="hidden sm:inline text-xl font-bold">PlayList</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 bg-zinc-800 flex items-center gap-3 rounded-md group hover:bg-zinc-700 border border-emerald-900 "
                >
                  <img
                    src={album.imageUrl}
                    alt="image"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1 hidden md:inline">
                    <p className="font-semibold truncate text-gray-100">
                      {album.title}
                    </p>
                    <p className="text-sm truncate text-emerald-500">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
