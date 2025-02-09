import { Router } from "express";
const router = Router();
import { getAllSongs } from "../controllers/song.controller.js";
import { getFeaturedSongs } from "../controllers/song.controller.js";
import { getTrendingSong } from "../controllers/song.controller.js";
import { getPickedSong } from "../controllers/song.controller.js";

router.route("/").get(getAllSongs);
router.route("/featured").get(getFeaturedSongs);
router.route("/trending").get(getTrendingSong);
router.route("/pickedForYou").get(getPickedSong);
export default router;
