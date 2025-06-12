import { verifyAccessToken } from '../controllers/helper.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token.' });
    } else {
      return res.status(500).json({ error: 'Failed to authenticate token.' });
    }
  }
};