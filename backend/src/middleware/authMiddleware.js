const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    // Look for the token in the "Authorization" header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    try {
        // Verify token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // Adds the user ID to the request
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};