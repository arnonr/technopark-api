const express = require("express");
const router = express.Router()

const controllers = require("../../controllers/DepartmentController");

router.get(
  "/",
  controllers.onGetAll
);
router.get(
  "/:id",
  controllers.onGetById
);

module.exports = router;