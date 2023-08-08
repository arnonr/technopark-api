const uploadController = require("./UploadsController");

const methods = {
  // สร้าง
  async onUploadImage(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/images",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).send("success");
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadDocument(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/document",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).send("success");
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadVideo(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/froala/video",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).send("success");
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async onUploadUppy(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/uppy",
        "file"
      );

      if (pathFile == "error") {
        res.status(500).send("error");
      } else {
        res.status(201).send("success");
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = { ...methods };
