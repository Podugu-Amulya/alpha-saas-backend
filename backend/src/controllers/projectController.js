const pool = require('../config/db');

// MUST have "exports." here
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await pool.query(
            "INSERT INTO projects (name, description, tenant_id) VALUES ($1, $2, $3) RETURNING *",
            [name, description, req.user.id]
        );
        res.status(201).json({ success: true, project: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM projects WHERE tenant_id = $1", [req.user.id]);
        res.json({ success: true, projects: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};