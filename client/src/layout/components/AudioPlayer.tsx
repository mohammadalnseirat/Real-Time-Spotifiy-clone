import usePlayerStore from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  // ref for audio Element:
  const audioRef = useRef<HTMLAudioElement>(null);
  //! Ref for previous audio element:
  const prevAudioRef = useRef<string | null>(null);

  const { currentSong, playNextSong, isPlaying } = usePlayerStore();

  //? // handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // ? // handle song ends or handle play next song ends:
  useEffect(() => {
    // get the audion:
    const audio = audioRef.current;

    const handleEnd = () => {
      playNextSong();
    };
    //? add event listener to the audio element
    audio?.addEventListener("ended", handleEnd);

    // ? did mounted:
    return () => {
      //? remove event listener:
      audio?.removeEventListener("ended", handleEnd);
    };
  }, [playNextSong]);

  //? handle Song changes:
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    // check if this is actually a new song
    const isSongChange = prevAudioRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      //! reset the playback position
      audio.currentTime = 0;
      prevAudioRef.current = currentSong.audioUrl;
      //* play the audio:
      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);
  return <audio ref={audioRef} />;
};

export default AudioPlayer;

/* 
we will take ref from the audio element and based on 
the reference we will create and run the audion elemnt 
based on the function

*/
