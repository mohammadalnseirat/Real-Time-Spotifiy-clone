import FeaturedSkeleton from "@/components/skeletons/FeaturedSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedSkeleton />;
  if (error)
    return (
      <p className="text-red-500 text-center font-semibold text-lg mb-4">
        {error}
      </p>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.map((song) => (
        <div
          key={song._id}
          className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 group cursor-pointer relative transition-colors"
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
          />
          <div className="flex-1 p-4">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-sm truncate italic text-emerald-500">
              {song.artist}
            </p>
          </div>
          <PlayButton song={song} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;