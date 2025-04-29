import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get featured songs
router.get("/featured", async (req, res) => {
  try {
    const songs = await prisma.song.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        artist: true,
      },
      take: 10,
    });
    res.json(songs);
  } catch (error) {
    console.error("Error fetching featured songs:", error);
    res.status(500).json({ error: "Failed to fetch featured songs" });
  }
});

// Get songs picked for you (based on user's listening history)
router.get("/pickedForYou", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's top genres from listening history
    const topGenres = await prisma.listeningHistory.groupBy({
      by: ["song.genre"],
      where: {
        userId,
      },
      _count: {
        songId: true,
      },
      orderBy: {
        _count: {
          songId: "desc",
        },
      },
      take: 3,
    });

    const genreNames = topGenres.map((g) => g.song.genre);

    // Get recommended songs based on top genres
    const recommendedSongs = await prisma.song.findMany({
      where: {
        genre: {
          in: genreNames,
        },
      },
      include: {
        artist: true,
      },
      take: 10,
    });

    res.json(recommendedSongs);
  } catch (error) {
    console.error("Error fetching recommended songs:", error);
    res.status(500).json({ error: "Failed to fetch recommended songs" });
  }
});

// Get trending songs (most played in the last week)
router.get("/trending", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingSongs = await prisma.listeningHistory.groupBy({
      by: ["songId"],
      where: {
        playedAt: {
          gte: oneWeekAgo,
        },
      },
      _count: {
        songId: true,
      },
      orderBy: {
        _count: {
          songId: "desc",
        },
      },
      take: 10,
    });

    const songIds = trendingSongs.map((t) => t.songId);

    const songs = await prisma.song.findMany({
      where: {
        id: {
          in: songIds,
        },
      },
      include: {
        artist: true,
      },
    });

    // Sort songs to match the trending order
    const sortedSongs = songIds
      .map((id) => songs.find((song) => song.id === id))
      .filter(Boolean);

    res.json(sortedSongs);
  } catch (error) {
    console.error("Error fetching trending songs:", error);
    res.status(500).json({ error: "Failed to fetch trending songs" });
  }
});

export default router;
