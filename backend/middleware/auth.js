const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader); // DEBUG
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token from Header:', token); 

    if (!token) {
        console.log('No token, authorization denied'); 
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message); 
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};