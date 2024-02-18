const express = require("express");
const router = express.Router();
const Task = require("../modal/Task");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route: 01
// Creating a task using POST request:  '/api/task/createtask'   -: Login required
router.post(
  "/createtask",
  fetchuser,
  [
    // validation checks on creating task
    body("title", "Length of title must be atleast three character,").isLength({
      min: 3,
    }),
    body(
      "summary",
      "Length of summary must be atleast five character"
    ).isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request, if therer are error return bad request and errors and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, summary } = req.body;
      const task = Task({ title, summary, user: req.user.id });
      const saveTask = await task.save();
      // console.log(saveTask);
      res.json(saveTask);
    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Route: 02
// Fetching alltasks using GET request:  '/api/task/fetchalltasks'   -: Login required
router.get("/fetchalltasks", fetchuser, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    // console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route: 03
// Updating a task using PUT request:  '/api/tasj/updatetask/:id'   -: Login required
router.put(
  "/updatetask/:id",
  fetchuser, // /updatask/:id   --> here id is a task id
  async (req, res) => {
    try {
      const { title, summary } = req.body;
      const newTask = {};
      if (title) {
        newTask.title = title;
      }
      if (summary) {
        newTask.summary = summary;
      }
      // Find the task whose we want to updated.
      let task = await Task.findById(req.params.id);
      if (!Task) {
        return res.status(404).send("Not Found");
      }
      if (task.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      // task is updated
      task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: newTask },
        { new: true }
      );
      res.json(task);
    } catch (error) {
      console.error(error.message);

      res.status(500).send("Internal Server Error");
    }
  }
);

// Route: 04
// Delelting a task using DELETE request:  '/api/task/deletetask/:id'   -: Login required
router.delete(
  "/deletetask/:id",
  fetchuser, // /deletetask/:id   --> here id is a task id, whose want to deleting
  async (req, res) => {
    try {
      // Find the task whose  want to delete.
      let task = await Task.findById(req.params.id);
      if (!Task) {
        return res.status(404).send("Not Found");
      }
      if (task.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      // task is deleted
      task = await Task.findByIdAndDelete(req.params.id);
      res.json({ Success: "Task deleted", task: task });
    } catch (error) {
      // console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
