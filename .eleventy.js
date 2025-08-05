export default function (eleventyConfig) {
    eleventyConfig.setWatchThrottleWaitTime(1000);
    eleventyConfig.setUseGitIgnore(true);

    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");

    return {
        dir: {
            input: "src",
            output: "dist",
        },
    };
}
