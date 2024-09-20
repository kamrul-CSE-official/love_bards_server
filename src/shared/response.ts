import { Response } from 'express';

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T | null;
}

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
    data?: T;
  }
) => {
  const response: IResponse<T> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || 'Operation successful',
    meta: data.meta || undefined,
    data: data.data || null
  };

  res.status(data.statusCode).json(response);
};

export default sendResponse;
