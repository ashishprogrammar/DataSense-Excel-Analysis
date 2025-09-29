const xlsx = require("xlsx");
const { File, History } = require("../models/File");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");

function detectColumnTypes(data) {
  if (!data || data.length === 0) return {};

  const columns = Object.keys(data[0]);
  const types = {};

  columns.forEach((col) => {
    const values = data
      .map((row) => row[col])
      .filter((v) => v !== undefined && v !== null);
    const allNumbers = values.every((v) => !isNaN(Number(v)));

    types[col] = allNumbers ? "numeric" : "categorical";
  });

  return types;
}

exports.uploadExcel = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const newFile = new File({
      userId: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
    });

    await newFile.save();

    const columnTypes = detectColumnTypes(jsonData);

    res.status(200).json({
      message: "File uploaded and saved successfully",
      fileId: newFile._id,
      dataPreview: jsonData,
      columnTypes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Excel parsing failed", error: error.message });
  }
};

exports.updateChartOptions = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { selectedX, selectedY, chartType } = req.body;


    const history = await History.create({
      userId: req.user.id,
      fileId,
      selectedX,
      selectedY,
      chartType,
    });
    console.log(history);

    res.json({
      message: "Upload history saved",
      history,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save history", error: err.message });
  }
};

exports.getHistoryWithChartData = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id })
      .populate("fileId", "originalName path") // include file info
      .sort({ createdAt: -1 });

    
    const validHistory = history.filter(h => h.fileId);

    const result = validHistory.map((h) => {
      const filePath = h.fileId.path;
      const workbook = xlsx.readFile(filePath);
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      
      const labels = sheet.map((row) => row[h.selectedX] ?? "-");
      const data = sheet.map((row) => row[h.selectedY] ?? 0);

      return {
        _id: h._id,
        fileId: h.fileId._id,  
        fileName: h.fileId.originalName,
        selectedX: h.selectedX,
        selectedY: h.selectedY,
        chartType: h.chartType,
        uploadDate: h.createdAt,
        rowsCount: sheet.length,
        labels,
        data,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history with chart data" });
  }
};


exports.getAIInsights = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { selectedX, selectedY } = req.query;

    
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheet.length === 0) {
      return res.json({ text: "The Excel file is empty.", stats: {} });
    }

    
    let insightsText = `The Excel file has ${sheet.length} rows.`;

    
    let stats = {};
    if (selectedX && selectedY) {
      const xValues = sheet
        .map((row) => Number(row[selectedX]))
        .filter((v) => !isNaN(v));
      const yValues = sheet
        .map((row) => Number(row[selectedY]))
        .filter((v) => !isNaN(v));

      if (xValues.length && yValues.length) {
        const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
        const min = (arr) => Math.min(...arr);
        const max = (arr) => Math.max(...arr);

        // Correlation
        const meanX = avg(xValues);
        const meanY = avg(yValues);
        const numerator = xValues.reduce(
          (acc, x, i) => acc + (x - meanX) * (yValues[i] - meanY),
          0
        );
        const denominator = Math.sqrt(
          xValues.reduce((acc, x) => acc + (x - meanX) ** 2, 0) *
            yValues.reduce((acc, y) => acc + (y - meanY) ** 2, 0)
        );
        const correlation =
          denominator !== 0 ? (numerator / denominator).toFixed(2) : 0;

        stats = {
          [`Average ${selectedX}`]: avg(xValues).toFixed(2),
          [`Min ${selectedX}`]: min(xValues),
          [`Max ${selectedX}`]: max(xValues),
          [`Average ${selectedY}`]: avg(yValues).toFixed(2),
          [`Min ${selectedY}`]: min(yValues),
          [`Max ${selectedY}`]: max(yValues),
          [`Correlation (${selectedX} vs ${selectedY})`]: correlation,
        };

        insightsText += ` Insights are based on your selected columns: ${selectedX} and ${selectedY}.`;
      } else {
        insightsText += ` However, one of the selected columns has no numeric data.`;
      }
    } else {
      insightsText += ` Please select X and Y columns to generate detailed insights.`;
    }

    await History.findOneAndUpdate(
      { userId: req.user.id, fileId },
      { aiInsights: insightsText },
      { new: true }
    );

    return res.json({ text: insightsText, stats });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    res.status(500).json({ error: "Error generating insights" });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.resolve(file.path); 
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }
    
    res.download(filePath, file.originalName); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error downloading file" });
  }
};


exports.deleteById = async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error clearing history" });
  }
};
