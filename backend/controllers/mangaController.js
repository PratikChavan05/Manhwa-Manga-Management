import axios from "axios";
import * as cheerio from "cheerio";
import Manga from "../models/mangaModel.js";
import TryCatch from "../utils/TryCatch.js";


const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  Referer: "https://google.com/",
  Connection: "keep-alive",
};

// Resolve relative/absolute URLs
const resolveUrl = (src, base) => {
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
};

// Try to fetch page with Axios
const tryFetchHtml = async (url) => {
  const res = await axios.get(url, {
    headers: defaultHeaders,
    timeout: 15000,
    maxRedirects: 10,
    validateStatus: (status) => status < 500,
  });
  if (res.status >= 400) throw new Error(`HTTP ${res.status}`);
  return res.data;
};

// Extract cover from Cheerio
const extractCoverFromCheerio = ($, base) => {
  const metaSelectors = [
    "meta[property='og:image']",
    "meta[property='og:image:url']",
    "meta[name='og:image']",
    "meta[name='og:image:url']",
    "meta[name='twitter:image']",
    "meta[name='twitter:image:src']",
  ];

  for (const sel of metaSelectors) {
    const content = $(sel).attr("content");
    if (content) return resolveUrl(content, base);
  }

  const linkImg = $("link[rel='image_src']").attr("href");
  if (linkImg) return resolveUrl(linkImg, base);

  // JSON-LD block
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const j = JSON.parse($(el).html());
      const img =
        j?.image || j?.thumbnailUrl || (Array.isArray(j) && j[0]?.image);
      if (img) return resolveUrl(Array.isArray(img) ? img[0] : img, base);
    } catch {}
  });

  // Fallback to <img>
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

import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

const getCoverFromPuppeteer = async (url) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless, // ensures it works in serverless
  });

  const page = await browser.newPage();
  await page.setUserAgent(defaultHeaders["User-Agent"]);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });

  const cover = await page.evaluate(() => {
    const og =
      document.querySelector('meta[property="og:image"]')?.content ||
      document.querySelector('meta[name="twitter:image"]')?.content ||
      document.querySelector('link[rel="image_src"]')?.href;
    if (og) return og;

    const el = document.querySelector(
      "img[class*=cover], img[class*=thumb], img[id*=cover], img[id*=thumb]"
    );
    if (el) return el.dataset?.src || el.src;

    const first = document.querySelector("img");
    return first ? first.dataset?.src || first.src : null;
  });

  await browser.close();
  return cover ? new URL(cover, url).href : null;
};


// Unified entrypoint
export const getCoverFromWebsite = async (
  url,
  options = { puppeteerFallback: false }
) => {
  try {
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    let cover = null;

    try {
      const html = await tryFetchHtml(url);
      const $ = cheerio.load(html);
      cover = extractCoverFromCheerio($, url);
      if (cover) {
        console.log("✅ Cover found by cheerio:", cover);
        return cover;
      }
      console.log("ℹ️ No cover found via cheerio for:", url);
    } catch (err) {
      console.warn("❌ Axios fetch failed:", err.message);
    }

    if (!cover && options.puppeteerFallback) {
      console.log("⚡ Using Puppeteer fallback for:", url);
      cover = await getCoverFromPuppeteer(url);
      if (cover) {
        console.log("✅ Cover found by Puppeteer:", cover);
        return cover;
      }
    }
  } catch (err) {
    console.error("getCoverFromWebsite error:", err.message);
  }
  return null;
};

export const addManga = TryCatch(async (req, res) => {
  const { title, currentChapter, website, status, notes, releaseDay, totalChapters } = req.body;

  if (!title || !website) {
    return res.status(400).json({ message: "Title and website are required" });
  }

  const manga = await Manga.create({
    userId: req.user._id,
    title,
    currentChapter: currentChapter || 0,
    website,
    releaseDay,
    status: status || "Reading",
    notes,
    totalChapters: totalChapters || 0,
    coverImage: `https://placehold.co/300x420?text=${encodeURIComponent(title)}`, 
  });

  
  res.status(201).json({ message: "Manga added successfully", manga });

  (async () => {
    try {
      const coverImage =
        (await getCoverFromPuppeteer(website)) ||
        (await getCoverFromWebsite(website, { puppeteerFallback: false })) ||
        manga.coverImage; 

      if (coverImage !== manga.coverImage) {
        manga.coverImage = coverImage;
        await manga.save();
        console.log(`✅ Cover updated for manga: ${manga.title}`);
      }
    } catch (err) {
      console.warn(`❌ Failed to update cover for ${manga.title}:`, err.message);
    }
  })();
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
  if(currentChapter>manga.totalChapters){
    manga.totalChapters=currentChapter;
  }
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
