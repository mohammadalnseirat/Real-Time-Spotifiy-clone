import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";
import { useMusicStore } from "@/stores/useMusicStore";

const DashboardStats = () => {
  const { stats } = useMusicStore();
  const statsData = [
    {
      icon: ListMusic,
      label: "Total Music",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      value: stats.totalSongs.toString(),
    },
    {
      icon: Library,
      label: "Total Albums",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
      value: stats.totalAlbums.toString(),
    },
    {
      icon: Users2,
      label: "Total Artists",
      bgColor: "bg-orange-500/10",
      iconColor: "text-oranget-500",
      value: stats.totalArtists.toString(),
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      value: stats.totalUsers.toString(),
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
