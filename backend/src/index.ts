import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/scrapeLinkedIn", async (req, res) => {
  const jobUrl = req.query.url as string;

  if (!jobUrl || !jobUrl.includes("linkedin.com")) {
    return res.status(400).json({ error: "Invalid LinkedIn URL" });
  }

  try {
    const response = await fetch(jobUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim();
    const company =
      $("a[href*='/company/']").first().text().trim() ||
      $("span.topcard__flavor").first().text().trim();
    const location = $("span.topcard__flavor--bullet").first().text().trim();

    return res.status(200).json({ title, company, location });
  } catch (error) {
    console.error("Scraping failed:", error);
    return res.status(500).json({ error: "Failed to scrape LinkedIn job post" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
