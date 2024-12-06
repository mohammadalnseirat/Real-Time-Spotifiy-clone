import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "@/stores/usePlayerStore";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

//! Function To Format Time:
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayBackControls = () => {
  const { isPlaying, togglePlay, currentSong, playPreviousSong, playNextSong } =
    usePlayerStore();
  //! Some state for playback control and controls in sound and duration:
  const [volume, setVolume] = useState(75);
  const [duration, setDuration] = useState(0); //for line time
  const [currentTime, setCurrentTime] = useState(0);
  // get the audion element from the ref:
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //? UseEffect To Update the time and Handle Ennded and loaded metsdata:
  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    //? Event Listener To Update the time:
    audio.addEventListener("timeupdate", updateTime);
    //? Event Listener To Update the duration:
    audio.addEventListener("loadedmetadata", updateDuration);
    // ? Event Listener To Update the ended:
    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    //? Clean up function:
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  //! handle Seek:
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
    }
  };
  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-t-emerald-900 px-4">
      <div className="flex items-center justify-between h-full max-w-[1800px] mx-auto">
        {/* Current Song Start Here */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong?.imageUrl}
                alt="image-current-Song"
                className="size-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong?.title}
                </p>
                <p className="txt-sm truncate text-emerald-500 hover:underline cursor-pointer">
                  {currentSong?.artist}
                </p>
              </div>
            </>
          )}
        </div>
        {/* Current Song End Here */}

        {/* Player Controls Start Here */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="size-5" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={playPreviousSong}
              disabled={!currentSong}
              className="hover:text-emerald-500 text-zinc-400"
            >
              <SkipBack className="size-5" />
            </Button>
            <Button
              onClick={togglePlay}
              size={"icon"}
              className="bg-white hover:bg-white/80 text-emerald-600 rounded-full size-8"
            >
              {isPlaying ? (
                <Pause className="size-5 text-emerald-600" />
              ) : (
                <Play className="size-5 text-emerald-600" />
              )}
            </Button>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={playNextSong}
              disabled={!currentSong}
              className="hover:text-emerald-500 text-zinc-400"
            >
              <SkipForward className="size-5" />
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Repeat className="size-5" />
            </Button>
          </div>
          {/* Volume duration */}
          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-gray-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              onValueChange={handleSeek}
              step={1}
              className="w-full cursor-pointer hover:cursor-grab active:cursor-grabbing"
            />
            <div className="text-xs text-gray-400">{formatTime(duration)}</div>
          </div>
        </div>

        {/* Player Controls End Here */}

        {/* Volume Start Here */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[45%] justify-end">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="size-5" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="size-5" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <Laptop2 className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-emerald-500 text-zinc-400"
            >
              <Volume1 className="size-5" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 cursor-pointer hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
        {/* Volume End Here */}
      </div>
    </footer>
  );
};

export default PlayBackControls;
