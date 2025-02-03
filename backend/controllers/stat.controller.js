import { User } from "../models/user.models.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
export const getAllStats = async (req, res, next) => {
  try {
    const [totalUser, totalSong, totalAlbum, uniqueArtists] = await Promise.all(
      [
        User.countDocuments(),
        Song.countDocuments(),
        Album.countDocuments(),

        //fetch all the songs union it wiht albums and group data based on the artist
        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]
    );
    return res.status(200).json({
      totalAlbum,
      totalSong,
      totalUser,
      totalArtist: uniqueArtists[0]?.count || 0,
    });
  } catch (err) {}
};
