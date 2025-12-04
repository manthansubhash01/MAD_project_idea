const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["paragraph", "todo", "heading"],
    default: "paragraph",
  },
  text: { type: String, default: "" },
  checked: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const noteSchema = mongoose.Schema({
  title: { type: String },
  content: { type: String, default: "" },
  blocks: [blockSchema],
  folderId: { type: mongoose.Schema.ObjectId, ref: "Folder", required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
