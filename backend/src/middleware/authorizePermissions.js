const authorizePermissions = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
        throw new Error('Authentication error');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new Error('Unauthorized to access this route');
    }
    next();
  };
};

export default authorizePermissions;