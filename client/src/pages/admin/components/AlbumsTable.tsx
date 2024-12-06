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
import { Calendar, Loader, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";

const AlbumsTable = () => {
  const { isLoading, error, albums, deleteAlbum, fetchAlbums } =
    useMusicStore();
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);
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
          <TableHead>Release Year</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albums.map((album) => (
          <TableRow key={album._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img
                src={album.imageUrl}
                alt={album.title}
                className="size-10 object-cover rounded-md"
              />
            </TableCell>
            <TableCell className="font-medium">{album.title}</TableCell>
            <TableCell>{album.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <Calendar className="mr-2 size-4 text-emerald-500" />
                {album.releaseYear}
              </span>
            </TableCell>
            <TableCell>
              <span>
                <span className="inline-flex items-center gap-2 text-zinc-400">
                  <Music className="mr-2 size-4 text-emerald-500" />
                  {album.songs.length} Songs
                </span>
              </span>
            </TableCell>
            <TableCell className="tetx-right">
              <div className="flex items-center justify-end">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => deleteAlbum(album._id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-400/10"
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

export default AlbumsTable;
