// AuthService/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Fail fast if JWT_SECRET is missing — never fall back to a hardcoded value.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ Fatal: JWT_SECRET environment variable is not set. Exiting.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas — Proyecto_Ecomerce (clientes).");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// --- Mongoose Schema Definition ---
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Explicitly bind to the existing 'clientes' collection in Proyecto_Ecomerce.
const User = mongoose.model('Cliente', UserSchema, 'clientes');

// --- Routes ---
// All routes are prefixed with /auth to match API Gateway proxy expectations.

// 1. Register Endpoint
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username },
      token
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// 2. Login Endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username },
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// 3. Validate Token Endpoint (called internally by the API Gateway)
app.get('/auth/validate', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ isTokenValid: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ isTokenValid: true, user: { id: decoded.id, username: decoded.username } });
  } catch (err) {
    res.status(401).json({ isTokenValid: false, message: "Token is invalid or expired." });
  }
});

// --- Server Bootstrapping ---
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\nAuthService operational on port ${PORT}`);
  });
};

startServer();