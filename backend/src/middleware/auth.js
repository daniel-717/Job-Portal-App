import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Authentication Invalid: No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(payload.userId).select('role companyName isProfileComplete');
    
    if (!user) {
        throw new Error('Authentication Invalid: User not found');
    }

    req.user = { 
      userId: payload.userId, 
      role: user.role, 
      companyName: user.companyName,
      isProfileComplete: user.isProfileComplete 
    };
    next();
  } catch (error) {
    throw new Error('Authentication Invalid: Token is invalid');
  }
};

export default authMiddleware;