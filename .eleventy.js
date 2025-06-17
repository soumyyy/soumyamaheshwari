// .eleventy.js
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Custom collection for blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/**/*.md");
  });

  // Add a filter for readable dates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Add a filter for reading time
  eleventyConfig.addFilter("readingTime", content => {
    const words = content.split(/\s+/).length;
    const readingSpeed = 200; // words per minute
    return Math.ceil(words / readingSpeed);
  });

  // Passthrough copies for CSS and JS
  eleventyConfig.addPassthroughCopy({ "src/App.css": "css/App.css" });
  eleventyConfig.addPassthroughCopy({ "src/index.css": "css/index.css" });
  eleventyConfig.addPassthroughCopy("blog/js");

  return {
    dir: {
      input: "blog",
      includes: "_includes",
      output: "public/blog"
    }
  };
};