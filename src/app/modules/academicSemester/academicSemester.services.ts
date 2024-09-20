import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

const insertIntoBD = async (req: Request): Promise<IGenericResponse> => {
  const response: any = HttpService.post('/academic-semesters', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return response;
};

const getIntoBD = async (req: Request): Promise<IGenericResponse> => {
  console.log(req.params);
  const response: any = HttpService.get('/academic-semesters', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return response;
};

export const AcademicSemesterService = {
  insertIntoBD,
  getIntoBD
};
