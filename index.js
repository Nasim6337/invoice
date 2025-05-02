require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth.route');
const userRoutes = require('./routes/user-routes');
const invoiceRoutes = require('./routes/invoice.route');
const path = require('path');
const checkLogin=require('./middleware/auth-land-middleware')
const app = express();
const cookie=require('cookie-parser');
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
app.use(cookie())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Static")));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);

// Serve static homepage
app.get("/",checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Static',"HTML", 'index.html'));
});
app.get("/invoce", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'invoices.html'));
  });

  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'createInvoice.html'));
  });
  app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'register.html'));
  });
  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'login.html'));
  });
  app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'profile.html'));
  });

  app.get("/client", (req, res) => {
    res.sendFile(path.join(__dirname, 'Static',"HTML", 'client.html'));
  });




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
