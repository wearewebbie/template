import sharp from "sharp";
import fs from "fs";
import path from "path";

export default function (eleventyConfig) {

    eleventyConfig.on("eleventy.before", async () => {
        const inputDir = "src/assets/images";
        const outputDir = "dist/assets/images";

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const files = fs.readdirSync(inputDir);

        for (const file of files) {
            if (/\.(jpg|jpeg|png)$/i.test(file)) {

                const inputPath = path.join(inputDir, file);
                const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
                const outputPath = path.join(outputDir, outputFileName);

                if (fs.existsSync(outputPath)) continue;

                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`Optimized: ${file}`);
            }
        }
    });

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");

    return {
        dir: {
            input: "src",
            output: "dist",
        },
    };
}
