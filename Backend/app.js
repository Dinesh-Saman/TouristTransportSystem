const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const packageRoutes = require('./routes/packageRoutes');
const UserRoutes = require("./routes/userRoute");

const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Increase payload size limit (for file uploads)
app.use(express.json({ limit: '50mb' })); // For JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded requests

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/packages', packageRoutes);
app.use("/user", UserRoutes);  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'File size is too large. Maximum allowed is 50MB' });
  }
  
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});