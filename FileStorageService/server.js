// FileStorageService/server.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Multer Configuration (Disk storage for local dev)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// MongoDB Connection
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas — Proyecto_Ecomerce (archivos).");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// Schema
const FileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  uploadedAt: { type: Date, default: Date.now }
});

// Explicitly bind to 'archivos' collection in Proyecto_Ecomerce (created on first upload).
const FileMetadata = mongoose.model('Archivo', FileSchema, 'archivos');

// Populate req.user from headers injected by the API Gateway.
app.use((req, res, next) => {
    const userId = req.headers['user-id'];
    const userName = req.headers['user-name'];
    if (userId) {
        req.user = { id: userId, username: userName };
    }
    next();
});

// Verify that the API Gateway provided a valid user context.
const isProtected = (req, res, next) => {
    if (req.user && req.user.id) next();
    else res.status(401).json({ message: "Unauthorized: User context required." });
};

// Routes

// 1. Upload File
app.post('/upload', isProtected, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    try {
        const newFile = await FileMetadata.create({
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            ownerId: req.user.id
        });
        res.status(201).json({ message: "File uploaded successfully.", file: newFile });
    } catch (error) {
        res.status(500).json({ message: "Failed to save file metadata." });
    }
});

// 2. List Files
app.get('/files', isProtected, async (req, res) => {
    try {
        const files = await FileMetadata.find({ ownerId: req.user.id }).select('-path');
        res.status(200).json({ files });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve files." });
    }
});

// Boot
const startServer = async () => {
    await connectDB();
    // Ensure uploads dir exists
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    app.listen(PORT, () => console.log(`\nFileStorageService operational on port ${PORT}`));
};

startServer();