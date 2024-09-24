import httpStatus from 'http-status';
import jwt, { verify } from 'jsonwebtoken';
import config from '../config';
import ApiError from '../errors/apiError';

const secretKey = config.jwt.secret;

// Generate Access Token
export const generateAccessToken = (
  userId: string,
  role: string,
  name: string,
  email: string
): string => {
  return jwt.sign({ userId, role, name, email }, secretKey, { expiresIn: '20h' });
};

// Validate Access Token
export const verifyToken = (token: string) => {
  try {
    const isVerified = verify(token, config.jwt.secret);
    return isVerified as any;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};
