import { Request, Response } from 'express';
import usersServices from './users.services';
import sendResponse from '../../../shared/response';

class UserController {
  // Register user
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const user = await usersServices.register(name, email, password);
      sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: user
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: error.message
      });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await usersServices.login(email, password);
      if (result) {
        const { user, token } = result;
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Login successful',
          data: { user, token }
        });
      }
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        statusCode: 400,
        message: error.message
      });
    }
  }

  // Get user by ID
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await usersServices.getUserById(userId);
      if (!user) {
        sendResponse(res, {
          success: false,
          statusCode: 404,
          message: 'User not found'
        });
      } else {
        sendResponse(res, {
          success: true,
          statusCode: 200,
          data: user
        });
      }
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: 500,
        message: 'Internal server error'
      });
    }
  }
}

export default new UserController();
