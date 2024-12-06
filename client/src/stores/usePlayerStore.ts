import { song } from "@/types";
import { create } from "zustand";
import useChatStore from "./useChatStore";


//! defind the type here:
interface PlayStore {
  currentSong: song | null;
  queue: song[];
  isPlaying: boolean;
  currentIndex: number;

  //? Functions:
  initializeQueue: (songs: song[]) => void;
  playAlbum: (songs: song[], startIndex?: number) => void;
  setCurrentSong: (song: song | null) => void;
  togglePlay: () => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
}
const usePlayerStore = create<PlayStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1, // default Value is -1

  //? Functions To Initial Queue:
  initializeQueue: (songs: song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  //? Functions To Play Album:
  playAlbum: (songs: song[], startIndex = 0) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    const socket = useChatStore.getState().socket;
    // check the socket and send the event:
    if (socket.auth) {
      socket.emit("update_activities", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      isPlaying: true,
      currentIndex: startIndex,
    });
  },

  //? Functions To Set Current Song:
  setCurrentSong: (song: song | null) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song?._id);
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    });
  },

  //? Functions To Toggle Play:
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activities", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }
    set({ isPlaying: willStartPlaying });
  },

  //? Functions To Play Next Song:
  playNextSong: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;

    // if there is a next song to play, let's play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      const socket = useChatStore.getState().socket;
      if(socket.auth){
        socket.emit("update_activities", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      // update the state of the next song:
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      // no next song
      set({ isPlaying: false });
      // will be idle if there is no next song
      const socket = useChatStore.getState().socket;
      if(socket.auth){
        socket.emit("update_activities", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },

  //? Functions To Play Previous Song:
  playPreviousSong: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex - 1;
    // if there is a previous song to play, let's play it
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      const socket = useChatStore.getState().socket;
      if(socket.auth){
        socket.emit("update_activities", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }
      // update the state of the previous song:
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      // no previous song
      set({ isPlaying: false });
      // will be idle if there is no previous song
      const socket = useChatStore.getState().socket;
      if(socket.auth){
        socket.emit("update_activities", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },
}));

export default usePlayerStore;
