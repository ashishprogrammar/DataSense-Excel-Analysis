const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // import dotenv first
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'utils', '.env') });


const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.send('Excel Analytics Backend is working!');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Mongo Connected");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
