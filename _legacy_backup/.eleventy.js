// .eleventy.js
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Deep merge data for layouts and other configurations
  eleventyConfig.setDataDeepMerge(true);

  // Custom collection for blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/**/*.md");
  });

  // Add a filter for readable dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    if (!dateObj) return '';
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("w3DateFilter", dateObj => {
    if (!dateObj) return '';
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISO();
  });

  // Add a filter for reading time
  eleventyConfig.addFilter("readingTime", content => {
    if (!content) return 0;
    const words = content.split(/\s+/).length;
    const readingSpeed = 200; // words per minute
    return Math.ceil(words / readingSpeed);
  });

  // Passthrough copies for CSS, JS, and other assets into the /blog directory
  eleventyConfig.addPassthroughCopy({ "src/App.css": "blog/css/App.css" });
  eleventyConfig.addPassthroughCopy({ "src/index.css": "blog/css/index.css" });
  eleventyConfig.addPassthroughCopy({ "blog/js": "blog/js" });

  return {
    // Set the input and output directories
    dir: {
      input: "blog",
      includes: "_includes",
      data: "_data",
      output: "public"
    },
    // Set the default template engine
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};