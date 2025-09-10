import express from "express";
import {
  addManga,
  getMyMangas,
  getMangaById,
  updateManga,
  deleteManga,
  searchMangas,
  getMangaStats,
  bulkUpdateStatus,
  updateMangaChapter,
  getTrendingManga,
  sendWeeklyNotifications,
} from "../controllers/mangaController.js";
import { isAuth } from '../middlewares/isAuth.js';
const router = express.Router();

router.post("/", isAuth, addManga);        
router.get("/", isAuth, getMyMangas); 
router.get("/search", isAuth, searchMangas);
router.get("/stats", isAuth, getMangaStats);
router.put("/bulk-update", isAuth, bulkUpdateStatus);
router.get("/scrape", isAuth, getTrendingManga); 
router.post("/test", sendWeeklyNotifications);

router.get("/:id", isAuth, getMangaById);  
router.put("/:id", isAuth, updateManga);
router.put("/:id/chapter", isAuth, updateMangaChapter);
router.delete("/:id", isAuth, deleteManga);



export default router;
