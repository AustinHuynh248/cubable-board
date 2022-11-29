const express = require("express");
const router = express.Router();
const field = require("../controllers/field.controller");

// Create a new field
router.post("/create", field.createField);

// Get all the fields from a board
router.get("/:boardId/all", field.findAll);

// Get a field from a board
router.get("/:boardId/:id", field.findOne);

// Update fields
router.put("/update", field.updateField);

// Delete fields
router.delete("/delete", field.deleteField);

module.exports = router;
