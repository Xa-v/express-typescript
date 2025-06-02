import { Router, Request, Response, RequestHandler } from "express";
import { GradeService } from "./grade.service";

const router = Router();
const Grade = new GradeService();

// Create Grade with auto-generated scores
router.post("/addgrade", async (req: Request, res: Response) => {
  try {
    const result = await Grade.create(req.body);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

// DELETE grade by ID
router.delete('/:gradeid', (async (req: Request, res: Response): Promise<void> => {
  try {
    const gradeId = parseInt(req.params.gradeid, 10);
    if (isNaN(gradeId)) {
      res.status(400).json({ message: "Invalid grade ID." });
      return;
    }

    const result = await Grade.deleteGradeById(gradeId);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
}) as RequestHandler); // 👈 Cast to RequestHandler


// UPDATE PERFECT SCORE
router.put("/updateperfectscore/:id", (async (req: Request, res: Response): Promise<void> => {
  try {
    const gradeid = parseInt(req.params.id);
    const { perfectscore } = req.body;

    if (isNaN(gradeid)) {
      res.status(400).json({ message: "Invalid grade ID." });
      return;
    }

    const result = await Grade.updatePerfectScore(gradeid, perfectscore);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}) as RequestHandler);


// Create Attendance with auto-generated scores
router.post("/addattendance", async (req: Request, res: Response) => {
  try {
    const result = await Grade.createAttendance(req.body);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});




export default router;
