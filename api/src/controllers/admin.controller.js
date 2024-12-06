import { handleError } from "../utils/error.js";
import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function to upload to cloudinary:
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Failed to upload to cloudinary");
  }
};
//! 1-Function To Create a new Song:
export const createSong = async (req, res, next) => {
  try {
    // check if there is no audio file and image file:
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return next(handleError(401, "Please provide all files"));
    }

    //  get the data from the body:
    const { title, artist, duration, albumId } = req.body;
    //! to upload on the cloudinary:
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    //? create a new Song object:
    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      albumId: albumId || null,
      duration,
    });

    // ? save the song:
    await song.save();
    //* if song belongs to an album, update the album's songs array:
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    // ? send the response:
    res.status(201).json(song);
  } catch (error) {
    console.log("Error Creating Song", error.message);
    next(error);
  }
};

//! 2-Function To delete a Song:
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    //? find the song by id:
    const song = await Song.findById(id);
    if (!song) {
      return next(handleError(404, "Song not found"));
    }
    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: {
          songs: song._id,
        },
      });
    }

    //? delete the song:
    await Song.findByIdAndDelete(id);
    //? send the response:
    res.status(200).json({
      message: "Song has been deleted successfully!",
    });
  } catch (error) {
    console.log("Error deleting Song", error.message);
    next(error);
  }
};

//! 3-Function To Create Album:
export const createAlbum = async (req, res, next) => {
  try {
    // get the data from the body:
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    // ? create a new Album object:
    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error.message);
    next(error);
  }
};

//! 4-Function To delete Album:
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    //? find the album by id:
    const album = await Album.findById(id);
    if (!album) {
      return next(handleError(404, "Album not found"));
    }
    //? delete all songs in the album:
    await Song.deleteMany({ albumId: id });
    //? delete the album:
    await Album.findByIdAndDelete(id);
    //? send the response:
    res.status(200).json({ message: "Album has been deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteAlbum", error.message);
    next(error);
  }
};

//! 5-Function To check Admin:
export const checkAdmin = async (req, res, next) => {
  try {
    res.status(200).json({ admin: true });
  } catch (error) {
    console.log("Error in checkAdmin", error.message);
    next(error);
  }
};
