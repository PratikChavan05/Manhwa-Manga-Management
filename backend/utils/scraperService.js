import axios from "axios";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const scrapeMangadex = async () => {
  try {
    const limit = 10;
    const offset = Math.floor(Math.random() * 1000); 
    const url = `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&order[followedCount]=desc&includes[]=cover_art`;

    const { data } = await axios.get(url);

    return data.data.map(manga => {
      const coverArt = manga.relationships.find(rel => rel.type === "cover_art");
      const coverUrl = coverArt
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
        : null;

      // 🚀 Wrap cover in proxy
      const proxiedCover = coverUrl
        ? `/api/proxy/cover?url=${encodeURIComponent(coverUrl)}`
        : null;

      return {
        title: manga.attributes.title.en || "Unknown",
        url: `https://mangadex.org/title/${manga.id}`,
        cover: proxiedCover,
        source: "Mangadex"
      };
    });
  } catch (err) {
    console.error("❌ Scraping MangaDex failed:", err.message);
    return [];
  }
};


export const scrapeJikan = async () => {
  try {
    const limit = 10;
    const page = Math.floor(Math.random() * 20) + 1; 
    const url = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=${limit}`;

    const { data } = await axios.get(url);

    return data.data.map(manga => ({
      title: manga.title,
      url: manga.url,
      cover: manga.images.jpg.image_url,
      source: 'Jikan (MyAnimeList)'
    }));
  } catch (err) {
    console.error("❌ Scraping Jikan failed:", err.message);
    return [];
  }
};

export const scrapeAllSites = async () => {
  const allResults = [];
  const scrapers = [
    scrapeMangadex,
    scrapeJikan,
  ];

  for (const scraper of scrapers) {
    try {
      const results = await scraper();
      allResults.push(...results);
    } catch (err) {
      console.error("❌ Scraper error:", err.message);
    }
  }

  return allResults;
};
