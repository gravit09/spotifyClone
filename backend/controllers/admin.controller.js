import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import multer from "../lib/multer.js";

const upload = multer.fields([
  { name: "audioFile", maxCount: 1 },
  { name: "img", maxCount: 1 },
]);

const albumCoverUpload = multer.fields([{ name: "albumCover", maxCount: 1 }]);

const uploadToCloudinary = async (filePath) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return res.secure_url; // Return the uploaded file's URL
  } catch (err) {
    console.log("Cloudinary upload error:", err);
    throw new Error("Error while uploading to Cloudinary");
  }
};

export const uploadSong = [
  upload,
  async (req, res) => {
    try {
      if (!req.files || !req.files.audioFile || !req.files.img) {
        return res.status(400).json({
          message: "Missing upload files",
        });
      }

      const { title, artist, albumId, duration } = req.body;
      const audioFile = req.files.audioFile[0];
      const coverImage = req.files.img[0];

      const audioUrl = await uploadToCloudinary(audioFile.path);
      const imageUrl = await uploadToCloudinary(coverImage.path);

      const song = new Song({
        title,
        artist,
        audioUrl,
        imageUrl,
        albumId: albumId || null,
        duration,
      });
      await song.save();

      // Update album if song belongs to an album
      if (albumId) {
        await Album.findByIdAndUpdate(albumId, {
          $push: { songs: song._id },
        });
      }

      res.status(201).json({
        message: "Song uploaded successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong while uploading the song",
      });
      console.log("Upload error:", err);
    }
  },
];

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) {
      return res.status(401).json({
        message: "No song with this id found",
      });
    }
    if (song.albumId) {
      await Album.findByIdAndUpdate({
        $pull: { songs: song.id },
      });
    }

    await Song.findByIdAndUpdate({ id });

    return res.status(200).json({
      message: "Song deleted",
    });
  } catch (err) {
    console.log("Some error while deleting song", err);
    return res.status(400).json({
      message: "Something went wrong while deleting song",
    });
  }
};

export const uploadAlbum = [
  albumCoverUpload,
  async (req, res) => {
    try {
      if (!req.files || !req.files.albumCover) {
        return res.status(400).json({
          message: "Missing upload data",
        });
      }
      const { title, artists } = req.body;
      const albumCover = req.files.albumCover[0];
      const albumCoverUrl = await uploadToCloudinary(albumCover.path);

      const newAlbum = new Album({
        title,
        artists,
        albumCoverUrl,
      });

      await newAlbum.save();
      return res.status(201).json({
        message: "Album upload success",
      });
    } catch (err) {
      console.log("upload album err", err);
      return res.status(500).json({
        message: "Something went wrong while uploading album",
      });
    }
  },
];

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    await Song.findByIdAndDelete({
      albumId: id,
    });
    await Album.findByIdAndDelete({
      id,
    });
    return res.status(200).json({
      message: "Album deleted succesfully",
    });
  } catch (err) {
    console.log("err while deleting album", err);
    return res.status(500).json({
      message: "something went wrong while deleting album",
    });
  }
};
