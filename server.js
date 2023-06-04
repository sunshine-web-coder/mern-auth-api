const express = require("express");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const path = require("path");
const cors = require('cors');
const authRoutes = require("./routes/auth");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// MongoDB connection
connectDB();

// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decodedToken.userId;
    next();
  });
};

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("/api/auth", authRoutes);

app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
