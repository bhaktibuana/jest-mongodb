const Programmer = require("../models/Programmer");

const getData = async (req, res) => {
  try {
    const result = await Programmer.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Programmer.findById(id);
    if (!result) return res.status(404).json({ error: "Programmer not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const store = async (req, res) => {
  const { body } = req;
  try {
    const result = await Programmer.create(body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  try {
    const result = await Programmer.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!result) return res.status(404).json({ error: "Programmer not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await Programmer.findByIdAndDelete(id);
    } catch (e) {
      res.status(404).json({ error: "Programmer not found" });
    }
    res.send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getData,
  getDetail,
  store,
  update,
  destroy,
};
