const pool = require('../config/db');

exports.getProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE tenant_id = $1', [req.user.tenantId]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await pool.query(
            'INSERT INTO projects (name, description, tenant_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, req.user.tenantId, req.user.id]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};