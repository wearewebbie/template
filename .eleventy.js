import sharp from "sharp";
import fs from "fs";
import path from "path";

export default function (eleventyConfig) {

    // Environment check
    const env = process.env.NODE_ENV;
    const isLocal = env === "local";
    const isDev = env === "development";
    const isProd = env === "production";

    const outputDir = isProd ? "dist-prod" : isDev ? "dist-dev" : "dist";

    eleventyConfig.addFilter("lastModifiedDate", function (filePath) {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split("T")[0];
    });

    eleventyConfig.addLiquidFilter("dateFormat", function (date) {
        return new Date(date).toISOString().split("T")[0];
    });

    // Image optimisation — skipped for local
    if (!isLocal) {
        eleventyConfig.on("eleventy.before", async () => {
            const inputDir = "src/assets/images";
            const imagesOutputDir = `${outputDir}/assets/images`;

            if (!fs.existsSync(imagesOutputDir)) {
                fs.mkdirSync(imagesOutputDir, { recursive: true });
            }

            const files = fs.readdirSync(inputDir);

            for (const file of files) {
                if (/\.(jpg|jpeg|png)$/i.test(file)) {

                    const inputPath = path.join(inputDir, file);
                    const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
                    const outputPath = path.join(imagesOutputDir, outputFileName);

                    if (fs.existsSync(outputPath)) continue;

                    await sharp(inputPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);

                    console.log(`Optimized: ${file}`);
                }
            }
        });
    }

    eleventyConfig.addCollection("debugUrls", function (collectionApi) {
        return collectionApi.getAll().map(item => {
            return item;
        });
    });

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");

    return {
        dir: {
            input: "src",
            output: outputDir,
        },
    };
}