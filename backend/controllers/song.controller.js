import { Song } from "../models/song.model";

export const getAllSongs = async (req, res) => {
  try {
    // -1 sort descending newest to oldest and 1 for reverse
    const songs = await Song.find().sort({ createdAt: -1 });
    if (!songs) {
      return res.status(200).json({
        message: "No songs found",
      });
    }
    return res.status(200).json({
      songs,
      message: "Songs fetched succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while fetching songs",
    });
  }
};

export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate();
  } catch (err) {}
};
export const getTrendingSong = async (req, res) => {};
export const getPickedSong = async (req, res) => {};
