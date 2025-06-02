import { db } from "../_helpers/db";
import { Gradelist } from "../grades/gradelist.entity";
import { Scorelist } from "../grades/score.entity";
import { Studentlist } from "../students/student.entity";

interface CreateGradeDto {
  attendanceDate?: string;
  scoretype: string;
  perfectscore: number;
}

export class GradeService {
  async create(data: CreateGradeDto) {
    const gradeRepo = db.dataSource.getRepository(Gradelist);
    const scoreRepo = db.dataSource.getRepository(Scorelist);
    const studentRepo = db.dataSource.getRepository(Studentlist);

    // 1. Save new grade entry
    const newGrade = gradeRepo.create({
      attendanceDate: data.attendanceDate,
      scoretype: data.scoretype,
      perfectscore: data.perfectscore,
      active: true,
    });

    const savedGrade = await gradeRepo.save(newGrade);

    // 2. Get all students
    const students = await studentRepo.find();

    // 3. Create score entries for each student
    const scoreEntries = students.map((student) =>
      scoreRepo.create({
        studentgradeid: student.studentgradeid,
        gradeid: savedGrade.gradeid,
        attendanceStatus: "",
        score: 0,
        active: true,
      })
    );

    await scoreRepo.save(scoreEntries);

    return {
      message: "Grade and associated scores created successfully.",
      grade: savedGrade,
      scoresCreated: scoreEntries.length,
    };
  }


  //DELETE GRADE
async deleteGradeById(gradeid: number) {
  
  const gradeRepo = db.dataSource.getRepository(Gradelist);
  const scoreRepo = db.dataSource.getRepository(Scorelist);

    // Check if grade exists
    const grade = await gradeRepo.findOne({ where: { gradeid } });
    if (!grade) {
      throw new Error("grade not found.");
    }

      // 2. Find related score entries
  const scoresToDelete = await scoreRepo.find({ where: { grade: { gradeid } } });

    // 3. Delete related scores
  if (scoresToDelete.length > 0) {
    await scoreRepo.remove(scoresToDelete);
  }

    // 4. Delete the grade itself
  await gradeRepo.remove(grade);

  return {
    message: "Grade and associated score entries deleted successfully.",
    scoresDeleted: scoresToDelete.length,
  };

}

}