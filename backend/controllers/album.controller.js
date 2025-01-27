import { Album } from "../models/album.model";

export const getAllAlbum = async (req, res) => {
  try {
    const allAlbums = await Album.find();
    return res.status(200).json({
      message: "All albums fetched succesfully",
      allAlbums,
    });
  } catch (err) {
    console.log("error while getting albums", err);
    return res.status(400).json({
      message: "Something went wrong while fething songs",
    });
  }
};

export const getAllAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    //to get all the songs from a particular album we use populate because we only have array of id
    const album = await Album.findById({
      id,
    }).populate("songs");
    if (!album) {
      return res.status(404).json({
        message: "No album with this id found",
      });
    }
    return res.status(200).json({
      message: "Album fetched",
      album,
    });
  } catch (err) {
    console.log("album with id error", err);
    return res.status({
      message: "Something went wrong while fetching album with given id",
    });
  }
};
