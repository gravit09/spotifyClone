import { Song } from "../models/song.model.js";

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
    //will fetch 6 random songs
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1, //one represent the field should be included
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.json(songs);
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong while fetching featured songs",
    });
  }
};

export const getPickedSong = async (req, res) => {
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
    res.json(songs);
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong while fetching picked songs",
    });
  }
};

export const getTrendingSong = async (req, res) => {
  try {
    //will fetch 6 random songs
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
    res.json(songs);
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong while fetching featured songs",
    });
  }
};
