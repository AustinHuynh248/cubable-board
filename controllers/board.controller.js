const db = require("../models");
const Board = db.Board;
const Item = db.Item;
const Field = db.Field;

// Create and Save a new Tutorial
const createBoard = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).json({
      message: "Name can't be empty",
    });
  }

  // Save Board in the database
  try {
    const prevOrder = await Board.findOne({ order: [["id", "DESC"]] });

    // Create a Board
    const board = {
      name: req.body.name,
      order: prevOrder ? prevOrder.order + 1 : 1,
    };
    const result = await Board.create(board);
    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Board",
    });
  }
};

// Retrieve all Boards from the database.
const findAll = async (req, res) => {
  try {
    const result = await Board.findAll({ include: [Item, Field] });
    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while finding all the Board",
    });
  }
};

// Retrieve detail from a board from the database.
const findOne = async (req, res) => {
  // Validate request
  if (!req.params.id) {
    return res.status(400).json({
      message: "Board ID need to be specify",
    });
  }
  const boardId = req.params.id;

  try {
    const result = await Board.findOne({
      where: { id: boardId },
      include: [Item, Field],
    });
    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while finding all the Board",
    });
  }
};

// Update a Boards by the id in the request
const updateBoard = async (req, res) => {
  if (!req.body.boardId) {
    return res.status(400).json({
      message: "Board Id need to be specify",
    });
  }
  const { boardId } = req.body;

  try {
    const board = await Board.findOne({ where: { id: boardId } });

    if (!board)
      return res.status(400).json({
        status: "fail",
        message: `Board Id = ${boardId} doesn't exist`,
      });

    const result = await Board.update(req.body, {
      where: { id: boardId },
    });

    return res
      .status(200)
      .json({ status: "success", message: `Update ${result.length} items` });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || `Error occurred updating Board with id ${id}`,
    });
  }
};

// Delete a Boards with the specified id in the request
const deleteBoard = async (req, res) => {
  if (!req.body.boardId) {
    return res.status(400).json({
      message: "Board Id need to be specify",
    });
  }
  const { boardId } = req.body;

  try {
    const result = await Board.destroy({
      where: { id: boardId },
    });

    if (!result)
      return res
        .status(400)
        .json({ status: "fail", message: `Can't find id = ${boardId}` });

    return res
      .status(200)
      .json({ status: "success", message: `Delete ${result} items` });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message:
        error.message || `Error occurred deleting Board with id ${boardId}`,
    });
  }
};

module.exports = {
  createBoard,
  findAll,
  findOne,
  updateBoard,
  deleteBoard,
};
