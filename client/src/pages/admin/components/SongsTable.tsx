import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Loader, Trash2 } from "lucide-react";

const SongsTable = () => {
  const { songs, isLoading, error, deleteSong } = useMusicStore();
  console.log("songs", songs);

  if (isLoading) {
    return (
      <p className="flex items-center justify-center py-8">
        <span className="text-gray-500">Loading...</span>
        <Loader className="text-emerald-500 animate-spin ml-2" />
      </p>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">{error}</p>;
      </div>
    );
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[60px]">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song) => (
          <TableRow key={song._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img
                src={song.imageUrl}
                alt={song.title}
                className="size-10 rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium capitalize">
              {song.title}
            </TableCell>
            <TableCell>{song.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <Calendar className="size-5 text-emerald-500" />
                {song.createdAt.split("T")[0]}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => deleteSong(song._id)}
                  variant={"ghost"}
                  size={"sm"}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/50"
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SongsTable;
