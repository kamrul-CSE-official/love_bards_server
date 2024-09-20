import { NextFunction, Request, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.services';
import sendResponse from '../../../shared/response';

const insertIntoBD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterService.insertIntoBD(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getIntoBD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterService.getIntoBD(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const AcademicSemesterController = {
  insertIntoBD,
  getIntoBD
};
