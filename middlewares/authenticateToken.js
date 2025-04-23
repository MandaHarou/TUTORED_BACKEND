const jwt = require('jsonwebtoken');
require('dotenv').config();
/*
              Main
 */
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

  // Supporter les tokens avec ou sans préfixe "Bearer "
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  console.log('Extracted Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded Token:', JSON.stringify(decoded, null, 2));
    
    // Ajout explicite des propriétés à l'objet de requête
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
/*
              End
 */
module.exports = verifyToken;