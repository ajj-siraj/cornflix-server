const express = require("express");
const newsRouter = express.Router();
const News = require("../models/newsModel");
const Agenda = require("agenda");
const fetch = require("node-fetch");

//Configuring agenda
const newsAgenda = new Agenda({
  db: { address: "localhost:27017/cornFlix", collection: "agendaJobs" },
  processEvery: "10 seconds",
});

(async function () {
  const dailyNews = newsAgenda.create("fetchNews");
  await newsAgenda.start();
  await dailyNews.repeatEvery("1 day").save();
})();

//schedule news to be fetched from the api once a day and saved in the database.
newsAgenda.define("fetchNews", (job, done) => {
  const newsAPI = `https://newsapi.org/v2/everything?q=boxoffice&apiKey=${process.env.NEWS_API_KEY}&language=en`;
  fetch(newsAPI)
    .then((res) => res.json())
    .then((res) => res.articles.slice(0, 5))
    .then((res) => {
      News.find({}).then((news) => {
        News.deleteMany({}).then(() => {
          News.create(res).catch((err) => console.log(err));
          return;
        });
      });
    })
    .then(() => done())
    .catch((err) => console.log(err));
});

/* GET news */
newsRouter
  .route("/")
  .get((req, res, next) => {
    News.find({},"-_id").then((story) => {
      if (!story) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("NOTHING found.");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: 200, data: story });
      return;
    });
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("POST not allowed on this route.");
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT not allowed on this route.");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE not allowed on this route.");
  });

module.exports = newsRouter;
