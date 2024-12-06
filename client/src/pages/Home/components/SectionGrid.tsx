import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import { song } from "@/types";
import PlayButton from "./PlayButton";
//? define the type of the element:
type SectionGridProps = {
  title: string;
  songs: song[];
  isLoading: boolean;
};
const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  if (isLoading) {
    return <SectionGridSkeleton />;
  }
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 capitalize">
          {title}
        </h2>
        <Button
          variant={"link"}
          className="text-sm text-emerald-500 hover:text-emerald-600"
        >
          Show All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-800/40 rounded-md p-4 hover:bg-zinc-700/40 group cursor-pointer "
          >
            <div className="relative mb-4">
              <div className="acspect-square rounded-md overflow-hidden shadow-lg">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-emerald-500 italic truncate text-sm">
              {song.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
