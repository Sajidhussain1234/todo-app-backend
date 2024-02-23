const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { Schema } = mongoose;

const TaskSchema = new Schema({
  // this is same like Foreign key in mysql
  // making connection using id with specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("task", TaskSchema);
