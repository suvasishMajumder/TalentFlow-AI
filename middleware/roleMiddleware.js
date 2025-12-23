

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        data: null, 
        error: { message: "Unauthorized - No user found" } 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        data: null, 
        error: { message: "Forbidden - Insufficient permissions" } 
      });
    }

    next();
  };
};
