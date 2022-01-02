import fs from "fs";
import path from "path";

import fg from "fast-glob";

const Image = require("@11ty/eleventy-img");

interface ImageStore {
  [key: string]: typeof Image;
}

const ImageFormats = [null, "webp"];
const ImageWidths = [
  400,
  800,
  1200,
];
const SrcDir = "src";
const ImageDir = "site_img";
const MediaGlob = `${SrcDir}/**/*.{jpg,jpeg,JPG,png}`;

const ensureDir = async (dirPath: string) => {
  const dirExists = await fs.promises.stat(dirPath)
    .then((s: fs.Stats) => true)
    .catch(err => false);

  if (!dirExists) {
    console.log(`Creating ${dirPath}`);
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
};

const processImages = async (srcDir: string, outputDir: string) => {
  console.log(`src: ${srcDir}; dest: ${outputDir}`);

  // Ensure destination directory exists
  await ensureDir(outputDir);

  console.log("Finding images");
  const imageSources = await fg(MediaGlob);
  let siteImageStore = <ImageStore>{};

  console.log("Processing images");
  for (const imageSource of imageSources) {
    const resourcePath = path.relative(srcDir, imageSource);
    const processMetadata = await Image(imageSource, {
      outputDir,
      formats: ImageFormats,
      widths: ImageWidths,
    });
    siteImageStore[imageSource] = processMetadata;
  };

  const imageStoreJSON = JSON.stringify(siteImageStore, null, 2);
  const imageStorePath = path.join(ImageDir, "site_images.json");

  await fs.writeFile(imageStorePath, imageStoreJSON, (err) => {
    if (err) {
      throw err;
    }

    console.log("Wrote image store to %s", imageStorePath);
  });

};

processImages(SrcDir, ImageDir);
