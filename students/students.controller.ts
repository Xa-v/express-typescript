import { Router, Request, Response, RequestHandler } from 'express';
import { StudentService } from './student.service';

const router = Router();
const Student = new StudentService();

//  Add a New Student
router.post('/addstudent', async (req: Request, res: Response) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
} catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
});



// Delete a student by ID
router.delete('/:studentgradeid', (async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = parseInt(req.params.studentgradeid, 10);
    if (isNaN(studentId)) {
      res.status(400).json({ message: "Invalid student ID." });
      return;
    }

    const result = await Student.deleteById(studentId);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred." });
    }
  }
}) as RequestHandler); // 👈 Cast to RequestHandler



// GET ALL STUDENTS SORTED A–Z
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.getAll();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

export default router;
