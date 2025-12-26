// 1. Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 2. Load environment variables
dotenv.config();

// 3. Import Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// 4. Middlewares
app.use(cors()); // Allows your frontend to talk to the backend
app.use(express.json()); // Allows the server to read JSON data from requests

// 5. Static Folders (For File Uploads)
// This line makes your "uploads" folder accessible via URL
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 7. Dynamic Port Assignment (CRITICAL FOR DEPLOYMENT)
// This checks if the cloud provider has a port (process.env.PORT)
// If not (like on your local PC), it defaults to 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📁 File uploads available at http://localhost:${PORT}/uploads`);
});