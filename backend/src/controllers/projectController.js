const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.createProject = async (req, res) => {
    const { name, description, category } = req.body;
    try {
        await pool.query(
            'INSERT INTO projects (name, description, category, subdomain) VALUES ($1, $2, $3, $4)',
            [name, description, category, req.user.subdomain]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.getProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE subdomain = $1', [req.user.subdomain]);
        res.json({ success: true, projects: result.rows });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.deleteProject = async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = $1 AND subdomain = $2', [req.params.id, req.user.subdomain]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

// NEW: Upload File Logic
exports.uploadFile = async (req, res) => {
    const { id } = req.params;
    const filePath = req.file.path; // Multer gives us this path
    try {
        await pool.query('UPDATE projects SET file_attachment = $1 WHERE id = $2', [filePath, id]);
        res.json({ success: true, message: "File uploaded and linked!" });
    } catch (err) { res.status(500).json({ success: false }); }
};