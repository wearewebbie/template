import Image from '@11ty/eleventy-img';
import fs from "fs";
import path from "path";

export default function (eleventyConfig) {

    // Environment check
    const env = process.env.NODE_ENV;
    const isLocal = env === "local";
    const isDev = env === "development";
    const isProd = env === "production";

    const outputDir = isProd ? "dist-prod" : isDev ? "dist-dev" : "dist";

    // Image shortcode
    eleventyConfig.addShortcode('image', async function (src, alt, cls, options = {}) {
        const {
            widths = [400, 800, 1200],
            formats = ['avif', 'webp', 'jpeg'],
            sizes = '100vw',
        } = options;

        const metadata = await Image(src, {
            widths,
            formats,
            outputDir: `./${outputDir}/assets/images/`,
            urlPath: '/assets/images/',
            filenameFormat: function (id, src, width, format) {
                const name = path.basename(src, path.extname(src));
                return `${name}-${width}w.${format}`;
            }
        });

        return Image.generateHTML(metadata, {
            alt,
            class: cls,
            sizes,
            loading: 'lazy',
            decoding: 'async',
        });
    });

    eleventyConfig.addFilter("lastModifiedDate", function (filePath) {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split("T")[0];
    });

    eleventyConfig.addLiquidFilter("dateFormat", function (date) {
        return new Date(date).toISOString().split("T")[0];
    });

    eleventyConfig.addCollection("debugUrls", function (collectionApi) {
        return collectionApi.getAll().map(item => {
            return item;
        });
    });

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/assets/svgs");

    return {
        dir: {
            input: "src",
            output: outputDir,
        },
    };
}