const express = require("express");
const router = express.Router();
const board = require("../controllers/board.controller");

// Create a new board
router.post("/create", board.createBoard);

// Get all the boards
router.get("/all", board.findAll);

// Get a specific board
router.get("/:id", board.findOne);

// Update boards
router.put("/update", board.updateBoard);

// Delete Boards
router.delete("/delete", board.deleteBoard);

module.exports = router;
