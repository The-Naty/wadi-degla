const roleHierarchy = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  MODERATOR: 1,
};

const authorize = (requiredRole) => {
  const isAuthorized = (req, res, next) => {
    const userRole = req.user.role;

    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next();
    } else {
      res.status(403).send('Access Denied');
    }
  };
  return isAuthorized;
};

module.exports = authorize;
