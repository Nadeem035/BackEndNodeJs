const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  let token = req.header('Authorization');
  
  token = token.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err); // Log the error message
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};
