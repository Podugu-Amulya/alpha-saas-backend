const pool = require('../config/db');

// This handles the "Launch" button from your dashboard
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // req.user.id is provided by your protect middleware
        const tenantId = req.user.id; 

        const query = `
            INSERT INTO projects (name, description, tenant_id) 
            VALUES ($1, $2, $3) 
            RETURNING *`;
        
        const result = await pool.query(query, [name, description, tenantId]);

        res.status(201).json({
            success: true,
            project: result.rows[0]
        });
    } catch (err) {
        console.error("Project Creation Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// This loads the projects for the "Active Projects" list
exports.getProjects = async (req, res) => {
    try {
        const tenantId = req.user.id;
        const result = await pool.query(
            "SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC", 
            [tenantId]
        );

        res.status(200).json({
            success: true,
            projects: result.rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};