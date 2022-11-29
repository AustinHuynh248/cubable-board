const express = require("express");
const router = express.Router();
const item = require("../controllers/item.controller");

// Create a new item
router.post("/create", item.createItem);

// Get all the Item of a board
router.get("/:boardId/all", item.findAll);

// Get a item from a board
router.get("/:boardId/:id", item.findOne);

// Update items
router.put("/update", item.updateItem);

// Delete items
router.delete("/delete", item.deleteItem);

module.exports = router;
