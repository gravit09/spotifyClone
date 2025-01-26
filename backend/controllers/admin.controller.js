import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import multer from "../lib/multer.js";

const upload = multer.fields([
  { name: "audioFile", maxCount: 1 },
  { name: "img", maxCount: 1 },
]);

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
