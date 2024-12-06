import { handleError } from "../utils/error.js";
import Album from "../models/album.model.js";

//! 1-Function To Get All Albums:
export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    console.log("Error getting all albums", error.message);
    next(error);
  }
};

//! 2-Function To Get One Album:
export const getSingleAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    console.log("Error getting single album", error.message);
    next(error);
  }
};
