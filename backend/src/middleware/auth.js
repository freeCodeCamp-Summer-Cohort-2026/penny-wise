const jwt = require('jsonwebtoken');

function attachUser(req, token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: payload.sub, email: payload.email, role: payload.role };
}

function requireAuth(req, res, next) {
  const token = req.cookies.authCookie;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'User is not authenticated with authCookie' });
  }

  try {
    attachUser(req, token);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const token = req.cookies.authCookie;

  if (token) {
    try {
      const payload = jwt.verify(token.toString(), process.env.JWT_SECRET);
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
    } catch (err) {
      // Ignore invalid tokens and continue as an anonymous requester.
      console.log(err);
    }
  }

  return next();
}

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    return next();
  };
};

module.exports = { requireAuth, optionalAuth, checkRole };
