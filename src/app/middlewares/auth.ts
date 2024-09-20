import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/apiError';
import { IAuthUser } from '../../interfaces/auth';
import { verifyToken } from '../../helpers/jwtHelper';

const auth =
  (...requiredRoles: string[]) =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Get the token
      if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

      const verifiedUser: IAuthUser = verifyToken(token);
      if (!verifiedUser) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next(); // Pass control to the next middleware if everything is good
    } catch (error) {
      next(error); // Handle errors (like token expiration or invalid token)
    }
  };

export default auth;
