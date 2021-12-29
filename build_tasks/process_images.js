const Image = require("@11ty/eleventy-img");
const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

const widths = [null, 320, 560, 800, 1040, 1280];
const formats = [null, "webp"];

const process_images = async (srcDir, destDir) => {
    console.log(`src: ${srcDir}; dest: ${destDir}`);
    const mediaGlob = `${srcDir}/**/*.{jpg,jpeg,JPG,png}`;
    const mediaSources = await fg(mediaGlob);

    mediaSources.forEach(async (mediaSource) => {
        const resourcePath = path.relative(srcDir, mediaSource);
        console.log(resourcePath);
        const destPath = path.join(destDir, resourcePath);
        const outputDir = path.dirname(destPath);
        const urlPath = path.dirname(resourcePath);

        // Ensure destination directory exists
        fs.stat(outputDir, (err, stats) => {
            if (err) {
                throw err;
            }

            if (!stats.isDirectory()) {
                console.log(`Creating ${outputDir}`);
                fs.mkdir(outputDir, { recursive: true }, (err) => {
                    throw err
                })
            }

        });

        // process this image
        const metadata = await Image(mediaSource, {
            formats,
            outputDir,
            urlPath,
            widths: widths,
            filenameFormat: function (id, src, width, format, options) {
                const base = path.basename(src, path.extname(src));
                return `${base}-${width}.${format}`;
            }
        });
        console.log(metadata);
    })
}

process_images("src", "dist");