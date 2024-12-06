import { handleError } from "../utils/error.js";
import Song from "../models/song.model.js";

//! 1-Function To Get All Songs:
export const getAllSongs = async (req, res, next) => {
  try {
    // -1 = Descending => newest -> oldest
    // 1 = Ascending => oldest -> newest
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.log("Error getting all songs", error.message);
    next(error);
  }
};

//! 2-Function To Get Featured Song:
export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 }, // sample 6 documents
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    // ? send the response:
    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error.message);
    next(error);
  }
};

//! 3-Function To Get Made For You Song:
export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getMadeForYouSongs", error.message);
    next(error);
  }
};

//! 4-Function To Get Trending Song:
export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getTrendingSongs", error.message);
    next(error);
  }
};
