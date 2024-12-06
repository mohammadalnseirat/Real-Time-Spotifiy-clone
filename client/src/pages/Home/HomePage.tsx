import Topbar from "@/components/Topbar";
import FeaturedSection from "./components/FeaturedSection";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import usePlayerStore from "@/stores/usePlayerStore";

const HomePage = () => {
  const {
    featuredSongs,
    trendingSongs,
    madeForYouSongs,
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYouSongs,
    isLoading,
  } = useMusicStore();
  const { initializeQueue } = usePlayerStore();

  //? useEffect to initialize the queue:
  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...madeForYouSongs, ...trendingSongs, ...featuredSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs]);

  //! useEffect to fetch the functions:
  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);
  return (
    <div className="rounded-md overflow-hidden border-t border-t-emerald-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono capitalize mb-6">
            good afternoon
          </h1>
          <FeaturedSection />
          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomePage;
