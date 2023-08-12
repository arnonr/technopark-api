const uploadController = require("./UploadsController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const methods = {
  // สร้าง
  async onUploadImage(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/images/",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).json({ link: process.env.PATH_UPLOAD + pathFile });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadDocument(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/documents/",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).json({ link: process.env.PATH_UPLOAD + pathFile });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadVideo(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/videos/",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).json({ link: process.env.PATH_UPLOAD + pathFile });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadUppy(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(req, "/uppy/", "file");

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        const item = await prisma.news_gallery.create({
          data: {
            news_id: req.body.news_id != "null" ? Number(req.body.news_id) : null,
            news_gallery_file: pathFile,
            secret_key: req.body.secret_key,
            is_publish: 1,
            created_by: "arnonr",
            updated_by: "arnonr",
          },
        });

        res.status(201).json({
          message: "success",
          link: pathFile,
          news_id: item.news_id,
          news_gallery_id: item.id,
        });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = { ...methods };
