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
import { axiosInstance } from "@/lib/axios";
import { Loader, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseYear: new Date().getFullYear(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  //! handle Image Change:
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  //! handle Add new Album:
  const handleAddnewAlbum = async () => {
    setIsLoading(true);
    try {
      if (!imageFile) {
        return toast.error("Please upload an image");
      }
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("imageFile", imageFile);

      //? Fetch the data from the api:
      await axiosInstance.post("/v1/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //? clear the state:
      setNewAlbum({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
      });
      setImageFile(null);
      setAlbumDialogOpen(false);
      toast.success("new album added successfully");
    } catch (error: any) {
      toast.error("Failed to add album" + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-gray-950">
          <Plus className="mr-2 size-5" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 max-h-[80vh] border-emerald-700 overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription className="italic text-gray-400">
            Add a new song to your collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={handleImageChange}
          />
          {/* Image Uplaod Area Start Here */}
          <div
            onClick={() => imageRef.current?.click()}
            className="flex items-center justify-center border-2 border-dashed border-emerald-800 p-6 rounded-lg cursor-pointer"
          >
            <div className="text-center">
              {imageFile ? (
                <div className="space-y-2">
                  <div className="text-emerald-500 text-sm">
                    Image Selected Sucessfully!
                  </div>
                  <div className="text-zinc-400 text-xs">
                    {imageFile.name.slice(0, 15)}...
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

          {/* Album Details Area Start Here */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title :</label>
            <Input
              value={newAlbum.title}
              placeholder="Enter album title..."
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-meduim">Artist :</label>
            <Input
              value={newAlbum.artist}
              placeholder="Enter artist name..."
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, artist: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              value={newAlbum.releaseYear}
              onChange={(e) =>
                setNewAlbum({
                  ...newAlbum,
                  releaseYear: parseInt(e.target.value),
                })
              }
              placeholder="Enter release year..."
              min={1900}
              max={new Date().getFullYear()}
            />
          </div>

          {/* Album Details Area End Here */}
        </div>
        {/* Dialog Footer Start Here */}
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={
              isLoading || !imageFile || !newAlbum.title || !newAlbum.artist
            }
            onClick={handleAddnewAlbum}
          >
            {isLoading ? (
              <div className="flex items-center">
                Creating...
                <Loader className="text-red-500 animate-spin ml-2" />
              </div>
            ) : (
              "Add Album"
            )}
          </Button>
        </DialogFooter>

        {/* Dialog Footer End Here */}
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
