import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from '../../config';

export interface AuthenticatedRequest extends Request {
  user?: { name?: string; email?: string; userId?: string; role?: string };
}

const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use headers to get the Authorization header
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      console.log('No access token provided.');
      res.status(403).json({ message: 'Forbidden access', status: 'fail' });
      return;
    }

    jwt.verify(
      accessToken,
      config.jwt.secret as string,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          console.error('JWT verification error: ', err.message);
          res.status(403).json({ message: 'Forbidden access', status: 'fail' });
          return;
        }

        // Attach the decoded token (user) to the request
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error('ProtectRoute error: ', error);
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
};

export default protectRoute;
