// 1. Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 2. Load environment variables
dotenv.config();

// 3. Database Connection
// Since server.js is in 'src' and db.js is in 'src/config', use './config/db'
const pool = require('./config/db'); 

// 4. Import Routes
// Ensure these files exist in 'src/routes/'
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// 5. Middlewares
app.use(cors()); 
app.use(express.json()); 

// 6. Static Folders for File Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 7. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// --- 8. Health Check Endpoint (Mandatory Requirement #7) ---
// This returns system status and database connection status
app.get('/api/health', async (req, res) => {
    try {
        // Checks if DB is reachable
        await pool.query('SELECT 1'); 
        res.status(200).json({
            success: true,
            status: 'System is healthy',
            database: 'Connected'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 'System Unhealthy',
            database: 'Disconnected',
            error: err.message
        });
    }
});

// 9. Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// 10. Dynamic Port Assignment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/api/health`);
});