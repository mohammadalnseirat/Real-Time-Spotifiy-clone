import { useAuthStore } from "@/stores/useAuthStore";
import DashboardStats from "./components/DashboardStats";
import Header from "./components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Music } from "lucide-react";
import SongTabContent from "./components/SongTabContent";
import AlbumTabContent from "./components/AlbumTabContent";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats(); // Fetching the statistics for the dashboard. If you need more data, you can add more calls here.
  }, [fetchAlbums, fetchSongs, fetchStats]); // Calling the functions when the component mounts

  if (!isAdmin && !isLoading)
    return (
      <div className="text-center font-bold text-2xl text-red-500">
        You are not admin,Un-Authorized
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black p-8">
      <Header />
      <DashboardStats />
      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-900/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-emerald-600"
          >
            <Music className="size-5 mr-2" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-emerald-600"
          >
            <Album className="size-5 mr-2" />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <SongTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
