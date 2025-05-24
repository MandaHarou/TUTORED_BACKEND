const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log('Token Verification - Debugging Information:');
  console.log('Full Request Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(403).json({ 
      message: 'Aucun token fourni',
      headers: req.headers
    });
  }

  
  let token;
  if (authHeader.startsWith('Bearer')) {
    
    const tokenMatch = authHeader.match(/Bearer\s+(.+)/);
    token = tokenMatch ? tokenMatch[1].trim() : '';
  } else {
    token = authHeader.trim();
  }

  console.log('Extracted Token:', token);

  if (!token) {
    console.log('Token is empty after extraction');
    return res.status(403).json({ 
      message: 'Token vide ou mal formaté',
      authHeader
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded Token:', JSON.stringify(decoded, null, 2));
    
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    console.log('Set User Details:', {
      userId: req.userId,
      userRole: req.userRole
    });
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      message: 'Token invalide ou expiré',
      error: error.message,
      token: token
    });
  }
};

module.exports = verifyToken;