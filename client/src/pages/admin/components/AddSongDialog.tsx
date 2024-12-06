import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Loader, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
interface NewSong {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const AddSongDialog = () => {
  const { albums } = useMusicStore();
  //? states:
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    album: "",
    duration: "0",
  });

  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });

  const audioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  //? functions:
  const handleAddNewSong = async () => {
    setIsLoading(true);

    try {
      if (!files.audio || !files.image) {
        toast.error("Please upload both audio and image");
        return;
      }
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      if (newSong.album && newSong.album !== "none") {
        formData.append("albumId", newSong.album);
      }
      formData.append("audioFile", files.audio);
      formData.append("imageFile", files.image);
      await axiosInstance.post("/v1/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //? clear the state:
      setNewSong({
        title: "",
        artist: "",
        album: "",
        duration: "0",
      });
      setFiles({
        audio: null,
        image: null,
      });
      setSongDialogOpen(false);

      toast.success("new song added successfully");
    } catch (error: any) {
      toast.error("Failed to add song" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-gray-950">
          <Plus className="mr-2 size-5" />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 max-h-[80vh] border-emerald-700 overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription className="italic text-gray-400">
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="audio/*"
            hidden
            ref={audioRef}
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))
            }
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={(e) =>
              setFiles((prev) => ({ ...prev, image: e.target.files![0] }))
            }
          />
          {/* Image Uplaod Area Start Here */}
          <div
            onClick={() => imageRef.current?.click()}
            className="flex items-center justify-center border-2 border-dashed border-emerald-800 p-6 rounded-lg cursor-pointer"
          >
            <div className="text-center">
              {files.image ? (
                <div className="space-y-2">
                  <div className="text-emerald-500 text-sm">
                    Image Selected Sucessfully!
                  </div>
                  <div className="text-zinc-400 text-xs">
                    {files.image.name.slice(0, 15)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="size-8 text-emerald-500" />
                  </div>
                  <p className="mb-2 text-xs text-zinc-400">Upload Image</p>
                  <Button variant={"outline"} size={"sm"} className="text-xs">
                    Choose Image
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* Image Uplaod Area End Here */}
          {/* Audio Upload Area Start Here */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                onClick={() => audioRef.current?.click()}
                className="w-full border border-emerald-900"
              >
                {files.audio ? files.audio.name.slice(0, 15) : "Choose Audio"}
              </Button>
            </div>
          </div>
          {/* Audio Upload Area End Here */}

          {/* Song Details Area Start Here */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title :</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-meduim">Artist :</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Duration <span className="text-emerald-500">(optional)</span>
            </label>
            <Input
              value={newSong.duration}
              onChange={(e) =>
                setNewSong({
                  ...newSong,
                  duration: e.target.value || "0",
                })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Album <span className="text-emerald-500">(optional)</span>
            </label>
            <Select
              value={newSong.album}
              onValueChange={(value) =>
                setNewSong({ ...newSong, album: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select Album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Song Details Area End Here */}
        </div>
        {/* Dialog Footer Start Here */}
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 mb-2 md:mb-0"
            disabled={isLoading}
            onClick={handleAddNewSong}
          >
            {isLoading ? (
              <div className="flex items-center ">
                Uploading...
                <Loader className="text-red-600 animate-spin ml-2" />
              </div>
            ) : (
              "Add Song"
            )}
          </Button>
        </DialogFooter>

        {/* Dialog Footer End Here */}
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
