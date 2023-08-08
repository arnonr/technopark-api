const express = require("express");
// import api from './api/index.js' 
const news = require("./api/news");
const newsType = require("./api/news-type");
const annouce = require("./api/annouce");
const banner = require("./api/banner");
const video = require("./api/video");
const about = require("./api/about");
const department = require("./api/department");
const team = require("./api/team");

const router = express.Router();

router.use(
  `/api/v${process.env.API_VERSION}`,
  router.use("/news", news),
  router.use("/news-type", newsType),
  router.use("/annouce", annouce),
  router.use("/banner", banner),
  router.use("/video", video),
  router.use("/about", about),
  router.use("/department", department),
  router.use("/team", team),
);

module.exports = router;
