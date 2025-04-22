const isAdmin = (req, res, next) => {
  console.log('Admin Middleware - Debugging Information:');
  console.log('Full Request Object:', JSON.stringify(req.headers, null, 2));
  console.log('User ID:', req.userId);
  console.log('User Role:', req.userRole);
  console.log('Full User Object:', JSON.stringify(req.user, null, 2));

  // Vérification avec plusieurs méthodes
  const isAdminRole = 
    req.userRole === 'administrateur' || 
    (req.user && req.user.role === 'administrateur');

  if (isAdminRole) {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    return res.status(403).json({ 
      message: 'Accès refusé. Administrateur requis.',
      userRole: req.userRole,
      details: {
        userId: req.userId,
        headers: req.headers,
        user: req.user
      }
    });
  }
};

module.exports = isAdmin;