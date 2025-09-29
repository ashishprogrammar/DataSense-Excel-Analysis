const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const {
  uploadExcel,
  updateChartOptions,
  getAIInsights,
  getHistoryWithChartData,
  downloadFile,
  deleteById,
  deleteAll,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadExcel);
router.put("/:fileId/chart-options", auth, updateChartOptions);
router.get("/:fileId/ai-insights", auth, getAIInsights);
router.get("/historyWithChartData", auth, getHistoryWithChartData);
router.get("/download/:fileId", auth, downloadFile);
router.delete("/:id", auth, deleteById);

router.delete("/", auth, deleteAll);
module.exports = router;
