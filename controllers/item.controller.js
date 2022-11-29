const db = require("../models");
const Item = db.Item;
const Board = db.Board;
const Field = db.Field;

// Create and Save a new Tutorial
const createItem = async (req, res) => {
  // Validate request
  if (!req.body.boardId || !req.body.name) {
    return res.status(400).json({
      message: "Missing field to create a new item",
    });
  }
  const boardId = req.body.boardId;
  const name = req.body.name;

  try {
    const board = await Board.findOne({
      where: { id: boardId },
      include: [Field],
    });

    if (!board)
      return res
        .status(400)
        .json({ status: "fail", message: "Board Id not found " });

    // If no field found we create a new field
    if (board.Fields.length <= 0) {
      // Create a Field
      const newField = {
        name: "Name",
        description: "Name",
        order: 1,
        boardId: boardId,
        datatypeId: 1,
      };

      // Create a Item
      const newItem = {
        description: req.body.description ?? null,
        order: 1,
        boardId: boardId,
      };

      // Save Item in the database
      const item = await Item.create(newItem);
      const field = await Field.create(newField);
      await item.addField(field, { through: { name: name } });

      const result = await Item.findOne({
        where: { id: item.id },
        include: Field,
      });

      return res.status(200).json({ status: "success", message: result });
    } else {
      //  Get prev order
      const prevOrder = await Item.findOne({ order: [["id", "DESC"]] });

      // Create a Item
      const newItem = {
        descriptions: req.body.description ?? null,
        order: prevOrder ? prevOrder.order + 1 : 1,
        boardId: boardId,
      };

      // Save Item in the database
      const item = await Item.create(newItem);

      // Adding Field relation to all the item
      await item.addFields(board.Fields, { through: "ItemFields" });

      const result = await Item.findOne({
        where: { id: item.id },
        include: Field,
      });

      return res.status(200).json({ status: "success", message: result });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Item",
    });
  }
};

// Retrieve all Items from the database.
const findAll = async (req, res) => {
  // Validate request
  if (!req.params.boardId) {
    return res.status(400).json({
      message: "Board Id need to be specify",
    });
  }

  const boardId = req.params.boardId;
  try {
    const board = await Board.findOne({ where: { id: boardId } });

    if (!board)
      return res.status(400).json({
        status: "fail",
        message: "Board Id not exist",
      });

    const result = await Item.findAll({
      where: { boardId: boardId },
      include: [Field],
    });

    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Item",
    });
  }
};

// Retrieve all Items from the database.
const findOne = async (req, res) => {
  // Validate request
  if (!req.params.boardId || !req.params.id) {
    return res.status(400).json({
      message: "Missing info need to find an item",
    });
  }
  const itemId = req.params.id;
  const boardId = req.params.boardId;

  try {
    const board = await Board.findOne({ where: { id: boardId } });

    if (!board)
      return res.status(400).json({
        status: "fail",
        message: "Board Id not exist",
      });

    const result = await Item.findOne({
      where: { boardId: boardId, id: itemId },
      include: [Field],
    });

    if (!result)
      return res.status(400).json({
        status: "fail",
        message: "Item id not exist",
      });

    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Item",
    });
  }
};

// Update a Items by the id in the request
const updateItem = async (req, res) => {
  // Validate request
  if (
    !req.body.boardId ||
    !req.body.itemId ||
    !req.body.fieldId ||
    !req.body.name
  ) {
    return res.status(400).json({
      message: "Missing field for updating Item",
    });
  }
  const boardId = req.body.boardId;
  const itemId = req.body.itemId;
  const fieldId = req.body.fieldId;
  const name = req.body.name;

  try {
    const board = await Board.findOne({
      where: { id: boardId },
      include: [Field, Item],
    });

    if (!board)
      return res.status(400).json({
        status: "fail",
        message: `Board Id not exist`,
      });

    const field = board.Fields.find((field) => field.id == fieldId);
    const item = board.Items.find((item) => item.id == itemId);

    // Validate the item and field id exist
    if (!item || !field)
      return res.status(400).json({
        status: "fail",
        message: `Input Error Item Id or Field Id not exist`,
      });

    // Updating Value
    await item.addField(field, { through: { name: name } });
    // Getting value
    const updatedItem = await Item.findOne({
      where: { id: itemId },
      include: Field,
    });

    return res.status(200).json({
      status: "success",
      message: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message:
        error.message || `Error occurred updating Item with id ${itemId}`,
    });
  }
};

// Delete a Items with the specified id in the request
const deleteItem = async (req, res) => {
  if (!req.body.itemId || !req.body.boardId) {
    return res.status(400).json({
      message: "Missing info for delete",
    });
  }
  const { itemId, boardId } = req.body;

  try {
    const item = await Item.findOne({
      where: { boardId: boardId, id: itemId },
    });

    if (!item)
      return res.status(400).json({
        status: "fail",
        message: `Can't find matching item with id ${itemId} and board Id ${boardId}`,
      });

    const result = await Item.destroy({
      where: { id: itemId },
    });

    return res
      .status(200)
      .json({ status: "success", message: `Delete ${result} items ` });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message:
        error.message || `Error occurred deleting Item with id ${itemId}`,
    });
  }
};

module.exports = {
  createItem,
  findAll,
  findOne,
  updateItem,
  deleteItem,
};
