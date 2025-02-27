require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');


const _dirname = path.resolve()

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://murli-mustard-oil-two.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.static(path.join(_dirname, "/client/dist")))
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
})


mongoose.connect(process.env.MONGODB_URI, {
  retryWrites: true,
  dbName: process.env.DATABASE_NAME,
  w: 'majority'
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  images: [String],
  description: String,
  price: Number,
  stock: Number
});
const Product = mongoose.model("Product", ProductSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }]
});
const Cart = mongoose.model("Cart", CartSchema);

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Routes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post("/cart", authenticate, async (req, res) => {
  const { items } = req.body;
  const cart = new Cart({ userId: req.user.userId, items });
  await cart.save();
  res.json({ message: "Cart updated successfully" });
});

app.post("/checkout", authenticate, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) return res.status(400).json({ message: "Cart is empty" });
  await Cart.deleteOne({ userId: req.user.userId });
  res.json({ message: "Order placed successfully" });
});

app.post('/create-order', authenticate, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.post("/verify-payment", authenticate, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Create a signature to verify
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
