import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

interface AuthRequest extends Request {
  user?: any;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = { auth };
