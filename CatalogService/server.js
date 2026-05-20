// CatalogService Service (CatalogService/server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001; // Dedicated port for CatalogService

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
    console.log("✅ Connected to MongoDB Atlas — Proyecto_Ecomerce (productos).");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// --- Mongoose Schema Definition ---
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true]
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true]
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente'
  }
});

// Explicitly bind to the existing 'productos' collection in Proyecto_Ecomerce.
const Product = mongoose.model('Producto', ProductSchema, 'productos');


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
    if (req.user && req.user.id) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized: User context required from API Gateway." });
    }
};


// --- Routes ---

// 1. Get All Products (Read)
app.get('/products', isProtected, async (req, res) => {
  try {
    // Only retrieve products owned by the authenticated user
    const products = await Product.find({ ownerId: req.user.id }).select('name price');
    res.status(200).json({ 
        message: "Successfully retrieved user's products.",
        products: products.length > 0 ? products : [] 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
});

// 2. Create Product (Write)
app.post('/products', isProtected, async (req, res) => {
  const { name, sku, description, price } = req.body;
  
  if (!name || !sku || !price) {
    return res.status(400).json({ message: "Missing required fields: name, sku, price." });
  }

  try {
    const newProduct = await Product.create({
      name,
      sku,
      description,
      price,
      ownerId: req.user.id // Enforce ownership
    });
    res.status(201).json({ message: "Product created successfully.", product: newProduct });
  } catch (error) {
    // Handle unique constraint violations (e.g., SKU already exists)
    if (error.code === 11000) {
        return res.status(409).json({ message: "Product with this SKU already exists." });
    }
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product." });
  }
});

// --- Server Bootstrapping ---
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\nCatalogService operational on port ${PORT}`);
  });
};

startServer();