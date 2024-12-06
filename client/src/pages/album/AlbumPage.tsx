import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import usePlayerStore from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

//! Function To Format Duration:
const formattedDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60); // get the minutes in on hour
  const reminingSeconds = seconds % 60; // get the seconds in on minute
  return `${minutes}:${reminingSeconds.toString().padStart(2, "0")}`;
};
const AlbumPage = () => {
  const { albumId } = useParams();
  const { isLoading, currentAlbum, fetchSingleAlbum } = useMusicStore();
  useEffect(() => {
    if (albumId) {
      fetchSingleAlbum(albumId);
    }
  }, [fetchSingleAlbum, albumId]);

  //? Get the Functions and Variables from the Player store to run the page:
  const { isPlaying, currentSong, togglePlay, playAlbum } = usePlayerStore();
  //! Function To handle Play Song:
  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };
  //! Function To handle Play Album:
  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    //? get the current Album play:
    const isCurrentAlbumPlaying = currentAlbum.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      //? play the first song of the album:
      playAlbum(currentAlbum?.songs, 0);
    }
  };
  if (isLoading) {
    return null;
  }
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-screen">
          {/* BG gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          {/* Content */}
          <div className="relative z-10">
            <div className="flex gap-6 p-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="size-[240px] rounded-md shadow-md"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium text-gray-400">Album</p>
                <h1 className="text-7xl font-bold font-mono text-emerald-500 my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} Songs</span>
                  <span className="text-emerald-500">
                    •{currentAlbum?.releaseYear}
                  </span>
                </div>
              </div>
            </div>
            {/* Play Button */}
            <div className="flex items-center gap-6 px-6 pb-4">
              <Button
                onClick={handlePlayAlbum}
                size={"icon"}
                className="size-14 rounded-full bg-green-500 hover:bg-green-600 hover:scale-105 transition-all duration-200"
              >
                {isPlaying ? (
                  <Pause className="size-7 text-black" />
                ) : (
                  <Play className="size-7 text-black" />
                )}
              </Button>
            </div>
            {/* Table Section */}
            <div className="bg-black/90 backdrop-blur-md">
              {/* Tabel Header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-4  text-sm text-zinc-300 border-b border-white/50 border-b-emerald-900">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="size-5" />
                </div>
              </div>
              {/* Table Body Song List */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    //? Find the song
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        onClick={() => handlePlaySong(index)}
                        key={song._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <span className="size-5 text-green-500">♫</span>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="size-4 hidden group-hover:block text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10 rounded-md"
                          />
                          <div>
                            <div className="font-medium text-gray-50">
                              {song.title}
                            </div>
                            <div className="font-medium text-emerald-500">
                              {song.artist}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formattedDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
