import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SongsTable from "./SongsTable";
import { Music } from "lucide-react";

import AddSongDialog from "./AddSongDialog";

const SongTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500 font-medium" />
              Song Library
            </CardTitle>
            <CardDescription className="text-zinc-400 italic capitalize">
              Manage your music catalog
            </CardDescription>
          </div>
          <AddSongDialog />
        </div>
      </CardHeader>
      <CardContent>
        <SongsTable />
      </CardContent>
    </Card>
  );
};

export default SongTabContent;
