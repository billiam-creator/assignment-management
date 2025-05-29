// backend/middleware/isAdmin.js

module.exports = function (req, res, next) {
    console.log('Inside isAdmin middleware, req.user:', req.user); // DEBUG LOG

    
    if (req.user && req.user.role === 'admin') {
        
        next();
    } else {
       
        return res.status(403).json({ msg: 'Access denied. Admin role required' });
    }
};