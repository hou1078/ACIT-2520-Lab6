const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "myfile");
const pathProcessed = path.join(__dirname, "grayscaled");



IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((filePaths) => {
    const grayScalePromises = filePaths.map((filePath) => {
      const fileName = path.basename(filePath);
      const outputPath = path.join(pathProcessed, fileName);
      return IOhandler.grayScale(filePath, outputPath);
    });

    return Promise.all(grayScalePromises);
  })
  .then(() => {
    console.log("All images have been converted to grayscale.");
  })
  .catch((err) => {
    console.error("Error:", err);
  });
