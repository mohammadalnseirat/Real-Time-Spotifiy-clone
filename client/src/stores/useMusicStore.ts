import { axiosInstance } from "@/lib/axios";
import { album, song, stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

//! define the type of the element:
interface MusicStore {
  songs: song[];
  albums: album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: album | null;
  madeForYouSongs: song[];
  featuredSongs: song[];
  trendingSongs: song[];
  stats: stats;
  fetchAlbums: () => Promise<void>;
  fetchSingleAlbum: (id: string) => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}
export const useMusicStore = create<MusicStore>((set) => ({
  songs: [],
  albums: [],
  currentAlbum: null,
  isLoading: false,
  error: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  //! 1-Function to Fetch Albums:
  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  //! 2-Function To Get Single Album:
  fetchSingleAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/v1/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  //! 3-Function To Fetch Made For You Songs:
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  // ! 4-Function To Fetch Featured Songs:
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  // ! 5-Function To Fetch Trending Songs:
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  //! 6-Function To Fetch Songs:
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  //! 7-Function To Fetch Stats:
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/v1/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  //! 8-Function To Delete Song:
  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/v1/admin/songs/${id}`);
      //  update the songs state:
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song Deleted Successfully");
    } catch (error: any) {
      console.log("Error deleting song", error);
      toast.error("Failed to Delete Song");
    } finally {
      set({ isLoading: false });
    }
  },

  //! 9-Function To Delete Album:
  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/v1/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        //! delete the songs from the album:
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      console.log("Error deleting album", error);
      toast.error("Failed to Delete Album");
    } finally {
      set({ isLoading: false });
    }
  },
}));
