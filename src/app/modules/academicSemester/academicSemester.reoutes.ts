import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();

router.get('/', AcademicSemesterController.getIntoBD);
router.post('/', AcademicSemesterController.insertIntoBD);

export const academicSemesterRouters = router;
