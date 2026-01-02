const pool = require('../config/db');

// Helper to log actions (Requirement #4)
const logAction = async (tenantId, userId, action, entityType, entityId) => {
    try {
        const query = `
            INSERT INTO audit_logs (tenant_id, user_id, action, entity_type, entity_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(query, [tenantId, userId, action, entityType, entityId]);
    } catch (err) {
        console.error("Audit Log Error:", err.message);
    }
};

module.exports = { logAction };