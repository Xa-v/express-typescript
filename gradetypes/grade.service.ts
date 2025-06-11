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

     const allowedScoreTypes = ["Attendance", "Quiz", "Project", "Exam"];
  if (!allowedScoreTypes.includes(data.scoretype)) {
    throw new Error("Invalid scoretype. Must be one of: Attendance, Quiz, Project, Exam.");
  }

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


// UPDATE PERFECTSCORE ONLY
async updatePerfectScore(gradeid: number, newPerfectScore: number) {
  const gradeRepo = db.dataSource.getRepository(Gradelist);
  const scoreRepo = db.dataSource.getRepository(Scorelist);

  // Validate input
  if (typeof newPerfectScore !== "number" || newPerfectScore <= 0) {
    throw new Error("perfectscore must be a positive number.");
  }

  // Check if grade exists
  const grade = await gradeRepo.findOne({ where: { gradeid } });
  if (!grade) {
    throw new Error("Grade not found.");
  }

  // Update perfectscore
  grade.perfectscore = newPerfectScore;
  await gradeRepo.save(grade);

  // Reset score field to 0 for related score entries
  await scoreRepo
    .createQueryBuilder()
    .update(Scorelist)
    .set({ score: 0 })
    .where("gradeid = :gradeid", { gradeid })
    .execute();

  return {
    message: "Perfect score and related student scores updated successfully.",
    updatedGrade: grade,
  };
}


// CREATE ATTENDANCE 

 async createAttendance(data: CreateGradeDto) {
    const gradeRepo = db.dataSource.getRepository(Gradelist);
    const scoreRepo = db.dataSource.getRepository(Scorelist);
    const studentRepo = db.dataSource.getRepository(Studentlist);

  

    // 1. Save new attendance entry
    const newGrade = gradeRepo.create({
      attendanceDate: data.attendanceDate,
      scoretype: "Attendance",
      perfectscore: 10,
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
      message: "Attendance and associated scores created successfully.",
      grade: savedGrade,
      scoresCreated: scoreEntries.length,
    };
  }




  // UPDATE SCORE BY SCOREID ONLY
async updateScore(scoreid: number, newScoreInput: number) {
  const gradeRepo = db.dataSource.getRepository(Gradelist);
  const scoreRepo = db.dataSource.getRepository(Scorelist);

 
  // Validate input
  if (typeof newScoreInput !== "number" || newScoreInput <= 0) {
    throw new Error("Score Input must be a positive number.");
  }

  // Check if score exists
  const score = await scoreRepo.findOne({ where: { scoreid } });
  if (!score) {
    throw new Error("Score not found.");
  }

   const grade = await gradeRepo.findOne({ where: { gradeid: score.gradeid } });
  if (!grade) {
    throw new Error("Associated grade not found.");
  }

  if (newScoreInput > grade.perfectscore) {
    throw new Error(`Score cannot exceed the perfect score of ${grade.perfectscore}.`);
  }
  // Update perfectscore
  score.score = newScoreInput;
  await scoreRepo.save(score);

  

  return {
    message: "score updated successfully.",
    updatedGrade: score,
  };
}



async getScoresByScoreType(scoretype: string) {
  const gradeRepo = db.dataSource.getRepository(Gradelist);
  const scoreRepo = db.dataSource.getRepository(Scorelist);
  const studentRepo = db.dataSource.getRepository(Studentlist);

  const allowedTypes = ["Attendance", "Quiz", "Project", "Exam"];
  if (!allowedTypes.includes(scoretype)) {
    throw new Error("Invalid scoretype.");
  }

  // Get all grades of this scoretype
  const grades = await gradeRepo.find({
    where: { scoretype },
    order: { gradeid: "ASC" },
  });

  const gradeIds = grades.map((g) => g.gradeid);

  // Get all students
  const students = await studentRepo.find({
    order: { studentName: "ASC" },
    relations: ["scores"],
  });

  // Map student scores
const result = students.map((student) => {
  const studentScores: Record<
    number,
    { scoreid: number; score: number | null }
  > = {};

  gradeIds.forEach((gid) => {
    const scoreEntry = student.scores.find((s) => s.gradeid === gid);
    studentScores[gid] = scoreEntry
      ? { scoreid: scoreEntry.scoreid, score: scoreEntry.score }
      : { scoreid: 0, score: null };
  });

    return {
      studentName: student.studentName,
      scores: studentScores, // { gradeid1: score, gradeid2: score, ... }
    };
  });

  return {
    headers: grades.map((g) => ({
      gradeid: g.gradeid,
      perfectscore: g.perfectscore,
    })),
    students: result,
  };
}



 // UPDATE Attendance BY SCOREID ONLY
async updateAttendance(scoreid: number, attendanceStatus: string) {
  const gradeRepo = db.dataSource.getRepository(Gradelist);
  const scoreRepo = db.dataSource.getRepository(Scorelist);

 
  // Check if score exists
  const score = await scoreRepo.findOne({ where: { scoreid } });
  if (!score) {
    throw new Error("Attendance not found.");
  }

   const grade = await gradeRepo.findOne({ where: { gradeid: score.gradeid } });
  if (!grade) {
    throw new Error("Associated grade not found.");
  }

  // Update the score based on the attendance status
const normalizedStatus = attendanceStatus
  ?.trim()
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase());

switch (normalizedStatus) {
    case 'Present':
      score.score = 10;
      break;
    case 'Absent':
      score.score = 0;
      break;
    case 'Late':
      score.score = 7;
      break;
    case 'Excused':
      score.score = 5;
      break;
    default:
      throw new Error('Invalid attendance status. Must be one of: Present, Absent, Late, Excused.');
  }

  
  // Update perfectscore
score.attendanceStatus = normalizedStatus;
  await scoreRepo.save(score);

  

  return {
    message: "Attendance status updated successfully.",
    scoreid: score.scoreid,
    updatedScore: score.score,
    attendanceStatus,
  };
}



}


