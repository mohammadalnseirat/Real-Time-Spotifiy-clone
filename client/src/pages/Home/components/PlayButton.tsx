import { Button } from "@/components/ui/button";
import usePlayerStore from "@/stores/usePlayerStore";
import { Pause, Play } from "lucide-react";
import { song } from "@/types";

const PlayButton = ({ song }: { song: song }) => {
  const { isPlaying, currentSong, togglePlay, setCurrentSong } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;
  //? Function To handle play:
  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };
  return (
    <Button
      onClick={handlePlay}
      size={"icon"}
      className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-600 hover:scale-105 opacity-0 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ${
        isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      } `}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayButton;
