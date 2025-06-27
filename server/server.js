const express = require('express');
const connection  = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const brandRoutes = require('./routes/brandRoutes');
const carRoutes = require('./routes/carRoutes');

dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // replace with frontend URL in prod
    credentials: true, // if using cookies/auth
}));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Static folder for images
app.use(express.static('uploads/'));

// ✅ Database connection
connection();

// ✅ Routes
app.use('/api/user', userRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/car', carRoutes);

// ✅ Port Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚗 Car API running on port ${PORT}`);
});
