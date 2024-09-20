import { Response } from 'express';

// Define Meta interface to reuse in both IResponse and sendResponse
interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;  // You can include totalPages here
}

// IResponse interface now uses Meta for the meta field
interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: Meta;  // Use Meta interface here
  data?: T | null;
}

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: Meta;  // Use Meta interface here
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
