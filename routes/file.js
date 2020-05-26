const express = require("express");
const mongoose = require("mongoose");
const fileRouter = express.Router();
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");

let gfs;
mongoose.connection.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// Storage
const storage = new GridFsStorage({
  url: process.env.DB_STRING,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

fileRouter
  .route("/upload")
  .all((req, res, next) => {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .post(upload.single("image"), (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 401,
        message: "Unauthorized to access this route. Please login.",
      });
      return;
    }

    User.findByIdAndUpdate(req.user._id, { $set: { profilePic: req.file.filename } }, { new: true })
      .then((user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message: `file ${req.file.filename} uploaded successfully.`,
          filename: req.file.filename,
        });
        return;
      })
      .catch((err) => next(err));
  });

fileRouter
  .route("/image/:filename")
  .all((req, res, next) => {
    if (req.method !== "GET") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .get((req, res, next) => {
    const file = gfs
      .find({
        filename: req.params.filename,
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
  });

module.exports = fileRouter;
