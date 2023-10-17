/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on("close", () => {
        console.log("Extraction operation complete");
        resolve();
      })
      .on("error", (err) => {
        console.error("Unzipped Error", err);
        reject(err);
      });
  });
};



/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve,reject) => {
    fs.readdir(dir,(err,files) =>{
      if(err){
        console.error("File read fail",err)
        reject(err)
      }else{
        const pngFiles = files.filter((file) => path.extname(file) === ".png");
        const filePaths = pngFiles.map((file) => path.join(dir, file));
        resolve(filePaths);
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const readableStream = fs.createReadStream(pathIn);
    let writableStream = fs.createWriteStream(pathOut); 
    const png = new PNG();

    readableStream
      .pipe(png)
      png.on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;

            const r = this.data[idx];
            const g = this.data[idx + 1];
            const b = this.data[idx + 2];

            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }

        this.pack().pipe(writableStream);

        writableStream.on("close", () => {
          console.log("Image has been converted to grayscale and saved");
          resolve();
        });
      })
      readableStream.on("error", (error) => {
        console.error("Image read error:", error);
        reject(error);
      });
  });
};

// grayScale: a filter that make pic black and white

module.exports = {
  unzip,
  readDir,
  grayScale,
};
