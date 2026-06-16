const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {

  // RSS feed plugin
  feedPlugin(eleventyConfig, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "feed",
      limit: 20,
    },
    metadata: {
      language: "en",
      title: "Garrek Stemo",
      subtitle: "Experimental physicist in Japan. Writing on science, economics, technology, and the good life.",
      base: "https://garrek.org/",
      author: {
        name: "Garrek Stemo",
      },
    },
  });

  // Posts collection — reverse chronological
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Feed collection — chronological (oldest first).
  // The RSS plugin does `collection | reverse | head(limit)` internally, so an
  // oldest-first input yields a newest-first feed and the limit keeps the
  // NEWEST 20 posts (a newest-first input would keep the oldest 20).
  eleventyConfig.addCollection("feed", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => a.date - b.date);
  });

  // Posts grouped by year — for the writing archive page
  eleventyConfig.addCollection("postsByYear", function (collectionApi) {
    const posts = collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);

    const years = {};
    for (const post of posts) {
      const year = post.date.getFullYear();
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(post);
    }

    // Return sorted array of [year, posts] pairs (newest first)
    return Object.entries(years)
      .sort((a, b) => b[0] - a[0]);
  });

  // Photography collection — list of photo filenames
  eleventyConfig.addCollection("photos", function () {
    const photoDir = path.join(__dirname, "src", "assets", "photography", "small");
    if (!fs.existsSync(photoDir)) return [];
    return fs.readdirSync(photoDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/assets/photography/small/${file}`);
  });

  // Passthrough copy — static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Date filter — matches Jekyll's '%A, %B %d %Y' format
  eleventyConfig.addFilter("date", function (dateObj, format) {
    const d = new Date(dateObj);
    const tz = "Asia/Tokyo";
    if (format === "%A, %B %d %Y") {
      const weekday = d.toLocaleDateString("en-US", { weekday: "long", timeZone: tz });
      const month = d.toLocaleDateString("en-US", { month: "long", timeZone: tz });
      const day = d.toLocaleDateString("en-US", { day: "2-digit", timeZone: tz });
      const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });
      return `${weekday}, ${month} ${day} ${year}`;
    }
    if (format === "%Y") {
      return d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });
    }
    // date_to_string equivalent: "03 Sep 2025"
    if (format === "date_to_string") {
      const day = d.toLocaleDateString("en-US", { day: "2-digit", timeZone: tz });
      const month = d.toLocaleDateString("en-US", { month: "short", timeZone: tz });
      const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });
      return `${day} ${month} ${year}`;
    }
    return d.toISOString();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "html", "njk"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
