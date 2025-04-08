import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;