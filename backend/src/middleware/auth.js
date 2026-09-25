const jwt = require('jsonwebtoken');

function readToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function attachUser(req, token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: payload.sub, email: payload.email, role: payload.role };
}

function requireAuth(req, res, next) {
  const token = readToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Missing or malformed Authorization header' });
  }

  try {
    attachUser(req, token);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const token = readToken(req);

  if (!token) {
    return next();
  }

  try {
    attachUser(req, token);
  } catch {
    return next();
  }

  return next();
}

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    return next();
  };
};

module.exports = { requireAuth, optionalAuth, checkRole };
