const db = require("../models");
const Field = db.Field;
const Board = db.Board;
const Datatype = db.Field_Datatype;

// Create and Save a new Tutorial
const createField = async (req, res) => {
  // Validate request
  if (!req.body.boardId || !req.body.datatype || !req.body.name) {
    return res.status(400).json({
      message: "Missing info need to create a field",
    });
  }
  const boardId = req.body.boardId;
  const fieldType = req.body.datatype;
  const fieldName = req.body.name;

  try {
    const board = await Board.findOne({ where: { id: boardId } });
    const datatype = await Datatype.findOne({ where: { name: fieldType } });

    if (!board)
      return res
        .status(400)
        .json({ status: "fail", message: "Board Id not found " });

    if (!datatype)
      return res
        .status(400)
        .json({ status: "fail", message: "Datatype not found " });

    //  Get prev order
    const prevOrder = await Field.findOne({ order: [["id", "DESC"]] });

    // Create a Field
    const field = {
      name: fieldName,
      description: req.body.description ?? null,
      order: prevOrder ? prevOrder.order + 1 : 1,
      boardId: board.id,
      datatypeId: datatype.id,
    };

    // Save Field in the database
    const result = await Field.create(field);
    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Field",
    });
  }
};

// Retrieve all Fields from the database.
const findAll = async (req, res) => {
  // Validate Request
  if (!req.params.boardId) {
    return res.status(400).json({
      message: "BoardId need to be specify",
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

    const result = await Field.findAll({
      where: { boardId: boardId },
      include: Datatype,
    });
    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Field",
    });
  }
};

// Retrieve all Items from the database.
const findOne = async (req, res) => {
  // Validate request
  if (!req.params.id || !req.params.boardId) {
    return res.status(400).json({
      message: "Missing Params to query field",
    });
  }
  const fieldId = req.params.id;
  const boardId = req.params.boardId;

  try {
    const board = await Board.findOne({ where: { id: boardId } });

    if (!board)
      return res.status(400).json({
        status: "fail",
        message: "Board Id not exist",
      });

    const result = await Field.findOne({
      where: { boardId: boardId, id: fieldId },
      include: [Datatype],
    });

    if (!result)
      return res.status(400).json({
        status: "fail",
        message: "Field Id not Exist",
      });

    return res.status(200).json({ status: "success", message: result });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || "Error occurred while creating the Item",
    });
  }
};

// Update a Fields by the id in the request
const updateField = async (req, res) => {
  if (!req.body.boardId || !req.body.fieldId) {
    return res.status(400).json({
      message: "Missing info for field update",
    });
  }
  const { boardId, fieldId } = req.body;

  try {
    const field = await Field.findOne({
      where: { boardId: boardId, id: fieldId },
    });

    if (!field)
      return res.status(400).json({
        status: "fail",
        message: `Can't find field id with field id ${fieldId} from board id ${boardId}`,
      });

    const result = await Field.update(req.body, {
      where: { boardId: boardId, id: fieldId },
    });

    return res
      .status(200)
      .json({ status: "success", message: `Update ${result.length} items` });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message:
        error.message || `Error occurred updating Field with id ${fieldId}`,
    });
  }
};

// Delete a Fields with the specified id in the request
const deleteField = async (req, res) => {
  if (!req.body.boardId || !req.body.fieldId) {
    return res.status(400).json({
      message: "Missing info for field update",
    });
  }
  const { boardId, fieldId } = req.body;

  try {
    const result = await Field.destroy({
      where: { boardId: boardId, id: fieldId },
    });

    if (!result)
      return res.status(400).json({
        status: "fail",
        message: `Can't find field with field id ${fieldId} from board id ${boardId}`,
      });

    return res
      .status(200)
      .json({ status: "success", message: `Delete ${result} items` });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message || `Error occurred deleting Field with id ${id}`,
    });
  }
};

module.exports = {
  createField,
  findAll,
  findOne,
  updateField,
  deleteField,
};
