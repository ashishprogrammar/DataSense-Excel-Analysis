const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  path: String,
  uploadDate: { type: Date, default: Date.now },
  selectedX: String,
  selectedY: String,
  chartType: String,
});

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    selectedX: String,
    selectedY: String,
    chartType: String,
    chartImage: String,
    aiInsights: String,
  },
  { timestamps: true }
);

module.exports = {
  File: mongoose.model("File", fileSchema),
  History: mongoose.model("History", historySchema),
};
