const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the request header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // 2. If no token, block them!
    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        // 3. Verify if the token is real
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the user info to the request so the routes can use it
        req.user = decoded;
        next(); // Move to the next step
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};