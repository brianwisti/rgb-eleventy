const Image = require('@11ty/eleventy-img');
const fs = require('fs');
const path = require('path');

const ImageStore = require("../../../site_img/site_img.json");

const AvailableWidths = [
  400,
  800,
  1200,
];


module.exports = (url, alt, widths = AvailableWidths, sizes = "100%") => {
  const { dir: imageDir } = path.parse(url);
  const srcPath = path.join('src', url);
  const imageAttributes = {
    alt,
    sizes,
    //loading: "lazy",
    decoding: "async",
  };

  if (srcPath in ImageStore) {
    const fullImageMetadata = ImageStore[srcPath];
    let imageMetadata = {};

    Object.entries(fullImageMetadata).forEach(([format, availableOutputs]) => {
      imageMetadata[format] = (availableOutputs.length < 2)
        ? availableOutputs
        : availableOutputs.filter((output) => widths.includes(output.width));
    });

    return Image.generateHTML(imageMetadata, imageAttributes);
  }
  else {
    console.log("IMAGE STORE LACKS %s", srcPath);
    return "image";
  }
};

