const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board.controller");

router.get("/board", boardController.getBoard);

module.exports = router;
