import axios from "axios";
import * as cheerio from "cheerio";
import Manga from "../models/mangaModel.js";
import TryCatch from "../utils/TryCatch.js";
import fs from "fs";

let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch (e) {
  console.warn("⚠️ Puppeteer not installed. Install with: npm i puppeteer");
}
const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  Referer: "https://google.com/",
  Connection: "keep-alive",
};
const resolveUrl = (src, base) => {
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
};
const tryFetchHtml = async (url) => {
  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": url,
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    timeout: 15000,
    maxRedirects: 10,
    validateStatus: (status) => status < 500,
  });
  if (res.status >= 400) throw new Error(`HTTP ${res.status}`);
  return res.data;
};
const extractCoverFromCheerio = ($, base) => {
  const og =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[name="og:image"]').attr("content") ||
    $('meta[name="og:image:url"]').attr("content");
  if (og) return resolveUrl(og, base);
  const tw =
    $('meta[name="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image:src"]').attr("content");
  if (tw) return resolveUrl(tw, base);
  const linkImg = $("link[rel='image_src']").attr("href");
  if (linkImg) return resolveUrl(linkImg, base);
  const ld = $("script[type='application/ld+json']")
    .map((i, el) => $(el).html())
    .get();
  for (const txt of ld) {
    try {
      const j = JSON.parse(txt);
      const img =
        j?.image || j?.thumbnailUrl || (Array.isArray(j) && j[0]?.image);
      if (img)
        return resolveUrl(Array.isArray(img) ? img[0] : img, base);
    } catch {
    }
  }
  const imgSelectors = [
    "img[class*=cover]",
    "img[class*=thumbnail]",
    "img[id*=cover]",
    "img[id*=thumbnail]",
    "img[data-src]",
    "img[srcset]",
    "img",
  ];
  for (const sel of imgSelectors) {
    const el = $(sel).first();
    if (el && el.length) {
      const src =
        el.attr("src") || el.attr("data-src") || el.attr("data-srcset");
      if (src) {
        const cleaned = src.split(",")[0].split(" ")[0].trim();
        return resolveUrl(cleaned, base);
      }
    }
  }
  return null;
};
const getCoverFromPuppeteer = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent(defaultHeaders["User-Agent"]);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
  const cover = await page.evaluate(() => {
    const og = document.querySelector('meta[property="og:image"]')?.content
            || document.querySelector('meta[name="twitter:image"]')?.content
            || document.querySelector('link[rel="image_src"]')?.href;
    if (og) return og;
    const el = document.querySelector('img[class*=cover], img[class*=thumb], img[id*=cover], img[id*=thumb]');
    if (el) return el.dataset?.src || el.src;
    const first = document.querySelector("img");
    return first ? (first.dataset?.src || first.src) : null;
  });
  await browser.close();
  return cover || null;
};
export const getCoverFromWebsite = async (
  url,
  options = { puppeteerFallback: false }
) => {
  try {
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    let html;
    try {
      html = await tryFetchHtml(url);
    } catch (err) {
      console.warn("❌ Axios fetch failed:", err.message);
      if (!options.puppeteerFallback) return null;
    }
    if (html) {
      const $ = cheerio.load(html);
      const cover = extractCoverFromCheerio($, url);
      if (cover) {
        console.log("✅ Cover found by cheerio:", cover);
        return cover;
      }
      console.log("ℹ️ No cover found via cheerio for:", url);
    }
    if (options.puppeteerFallback && puppeteer) {
      try {
        console.log("⚡ Using Puppeteer fallback for:", url);
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setUserAgent(defaultHeaders["User-Agent"]);
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 20000,
        });
        const cover = await page.evaluate(() => {
          const og =
            document.querySelector("meta[property='og:image']")?.content ||
            document.querySelector("meta[name='twitter:image']")?.content ||
            document.querySelector("link[rel='image_src']")?.href;
          if (og) return og;
          const el = document.querySelector(
            "img[class*=cover], img[class*=thumb], img[id*=cover], img[id*=thumb]"
          );
          if (el) return el.dataset?.src || el.src || null;
          const first = document.querySelector("img");
          return first ? el.dataset?.src || first.src : null;
        });
        await browser.close();
        if (cover) {
          const absolute = resolveUrl(cover, url);
          console.log("✅ Cover found by Puppeteer:", absolute);
          return absolute;
        }
      } catch (err) {
        console.warn("❌ Puppeteer fallback failed:", err.message);
      }
    }
  } catch (err) {
    console.error("getCoverFromWebsite error:", err.message);
  }
  return null;
};
export const addManga = TryCatch(async (req, res) => {
  const { title, currentChapter, website, status, notes, releaseDay } = req.body;
  if (!title || !website) {
    return res.status(400).json({ message: "Title and website are required" });
  }
  let coverImage = null;
  try {
    coverImage = await getCoverFromWebsite(website, { puppeteerFallback: false });
  } catch (err) {
    console.warn("Cheerio failed:", err.message);
  }
  if (!coverImage && puppeteer) {
    console.log("Using Puppeteer fallback...");
    coverImage = await getCoverFromPuppeteer(website);
  }
  const manga = await Manga.create({
    userId: req.user._id,
    title,
    currentChapter: currentChapter || 0,
    website,
    releaseDay,
    status: status || "Reading",
    notes,
    coverImage: coverImage || `https://placehold.co/300x420?text=${encodeURIComponent(title)}`,
  });
  res.status(201).json({ message: "Manga added successfully", manga });
});
export const getMyMangas = TryCatch(async (req, res) => {
  const mangas = await Manga.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json(mangas);
});
export const getMangaById = TryCatch(async (req, res) => {
  const manga = await Manga.findOne({ _id: req.params.id, userId: req.user._id });
  if (!manga) return res.status(404).json({ message: "Manga not found" });
  res.json(manga);
});
export const updateManga = TryCatch(async (req, res) => {
  const { id } = req.params;
  const{ title, currentChapter, website, status, notes ,rating,totalChapters,genre } = req.body;
  console.log(req.body)
  const manga = await Manga.findOne({ _id: id, userId: req.user._id });
  if (!manga) return res.status(404).json({ message: "Manga not found" });
  manga.title = title || manga.title;
  manga.currentChapter = currentChapter !== undefined ? currentChapter : manga.currentChapter;
  manga.website = website || manga.website;
  manga.status = status || manga.status;
  manga.notes = notes || manga.notes;
  manga.rating = rating !== undefined ? rating : manga.rating;
  manga.totalChapters = totalChapters !== undefined ? totalChapters : manga.totalChapters;
  manga.genre = genre || manga.genre;
  manga.updatedAt = new Date();
  await manga.save();
  res.json({ message: "Manga updated", manga });
});
export const updateMangaChapter = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { currentChapter } = req.body;
  const manga = await Manga.findOne({ _id: id, userId: req.user._id });
  if (!manga) return res.status(404).json({ message: "Manga not found" });
  if (currentChapter !== undefined) {
    manga.currentChapter = currentChapter;
    manga.updatedAt = new Date();
    await manga.save();
  }
  res.json({ message: "Chapter updated", manga });
});
export const deleteManga = TryCatch(async (req, res) => {
  const { id } = req.params;
  const manga = await Manga.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!manga) return res.status(404).json({ message: "Manga not found" });
  res.json({ message: "Manga deleted" });
});
export const searchMangas = TryCatch(async (req, res) => {
  const { query, status, genre, sortBy = 'updatedAt' } = req.query;
  let filter = { userId: req.user._id };
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } }
    ];
  }
  if (status && status !== 'All') {
    filter.status = status;
  }
  if (genre) {
    filter.genre = { $in: [genre] };
  }
  const mangas = await Manga.find(filter).sort({ [sortBy]: -1 });
  res.json(mangas);
});
export const bulkUpdateStatus = TryCatch(async (req, res) => {
  const { mangaIds, status } = req.body;
  const result = await Manga.updateMany(
    { _id: { $in: mangaIds }, userId: req.user._id },
    { status, updatedAt: new Date() }
  );
  res.json({ message: `Updated ${result.modifiedCount} mangas`, result });
});
export const getMangaStats = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const stats = await Manga.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalChapters: { $sum: '$currentChapter' }
      }
    }
  ]);
  const totalMangas = await Manga.countDocuments({ userId });
  const avgRating = await Manga.aggregate([
    { $match: { userId, rating: { $exists: true } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);
  res.json({
    statusBreakdown: stats,
    totalMangas,
    averageRating: avgRating[0]?.avgRating || 0
  });
});
import { LRUCache } from "lru-cache";
import { scrapeAllSites } from "../utils/scraperService.js";

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 60 // 1 hour
});

export const getTrendingManga = async (req, res) => {
  try {
    const refresh = req.query.refresh === "true";

    if (!refresh) {
      const cached = cache.get("trending_manga");
      if (cached) {
        console.log("⚡ Serving from LRU cache");
        return res.json(cached);
      }
    }

    const results = await scrapeAllSites();

    const payload = { count: results.length, mangas: results };
    cache.set("trending_manga", payload);

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import cron from 'node-cron';
import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_GMAIL,
    pass: process.env.MY_PASS
  }
});

const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

const notifyUsersOfNewChapters = async () => {
  const today = new Date().getDay(); 
  const todayName = Object.keys(dayMap).find(key => dayMap[key] === today);

  const mangas = await Manga.find({ releaseDay: todayName });

  const userMap = {};
  mangas.forEach(manga => {
    if (!userMap[manga.userId]) userMap[manga.userId] = [];
    userMap[manga.userId].push(manga);
  });

  for (const userId in userMap) {
    const user = await User.findById(userId);
    if (!user) continue;

    const mangaList = userMap[userId]
      .map(m => `"${m.title}" -> ${m.website}`)
      .join("\n");

    const mailOptions = {
      from: process.env.MY_GMAIL,
      to: user.email,
      subject: `New Chapter Updates for Today`,
      text: `Hey ${user.name},\n\nThe following mangas have new chapters today:\n\n${mangaList}`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Notifications sent to ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${user.email}:`, err.message);
    }
  }
};

cron.schedule("0 9 * * *", async () => {
  await notifyUsersOfNewChapters();
});

export const sendWeeklyNotifications = async (req, res) => {
  try {
    await notifyUsersOfNewChapters();
    res.json({ message: "Notifications sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
