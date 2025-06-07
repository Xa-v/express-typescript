import { Studentlist } from './student.entity';
import { Gradelist } from "../grades/gradelist.entity";
import { Scorelist } from "../grades/score.entity";
import { ComputedGradelist } from "../grades/computedgrade.entity"
import { db } from "../_helpers/db";

interface CreateStudentDto {
  studentName: string;
}

export class StudentService {

    //ADD STUDENT
  async create(data: CreateStudentDto) {
    const studentRepo = db.dataSource.getRepository(Studentlist);
    const gradeRepo = db.dataSource.getRepository(Gradelist);
    const scoreRepo = db.dataSource.getRepository(Scorelist);
    const computedGradeRepo = db.dataSource.getRepository(ComputedGradelist);
    
    const name = data.studentName;

    // Validate studentName
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("studentName must be a non-empty string.");
    }

    const trimmedName = name.trim();

    // Check for duplicate (case-insensitive)
    const existing = await studentRepo.findOne({
      where: {
        studentName: trimmedName,
      },
    });

    if (existing) {
      throw new Error("A student with this name already exists.");
    }

     // Create and save new student
    const newStudent = studentRepo.create({ studentName: trimmedName });
    const savedStudent = await studentRepo.save(newStudent);

    // Fetch all existing grades
    const allGrades = await gradeRepo.find();

    // Create corresponding score entries for the new student
    const scoreEntries = allGrades.map((grade) =>
      scoreRepo.create({
        studentgradeid: savedStudent.studentgradeid,
        gradeid: grade.gradeid,
        attendanceStatus: "",
        score: 0,
        active: true,
      })
    );

    // Save all score entries in bulk
    if (scoreEntries.length > 0) {
      await scoreRepo.save(scoreEntries);
    }


    // Create a corresponding computed grade entry
    const computedGrade = computedGradeRepo.create({
      studentgradeid: savedStudent.studentgradeid,
    });

    await computedGradeRepo.save(computedGrade);

    return savedStudent;
  }


  //DELETE STUDENT
    async deleteById(studentgradeid: number) {
    const studentRepo = db.dataSource.getRepository(Studentlist);
      const scoreRepo = db.dataSource.getRepository(Scorelist);
      const computedRepo = db.dataSource.getRepository(ComputedGradelist);

    // Check if student exists
    const student = await studentRepo.findOne({ where: { studentgradeid } });
    if (!student) {
      throw new Error("Student not found.");
    }

  // Find and delete all score entries for the student
  const scoreEntries = await scoreRepo.find({
    where: { studentgradeid },
  });

  if (scoreEntries.length > 0) {
    await scoreRepo.remove(scoreEntries);
  }

  // Delete computed grade entries (related via `student`)
  const computedGrades = await computedRepo.find({
    where: { student: { studentgradeid } },
  });
  if (computedGrades.length > 0) {
    await computedRepo.remove(computedGrades);
  }

  // Delete student
  await studentRepo.remove(student);

  return {
    message: "Student and associated scores and computed grades deleted successfully.",
    scoresDeleted: scoreEntries.length,
    computedGradesDeleted: computedGrades.length,
  };
}


// GET ALL STUDENTS SORTED A–Z
async getAll() {
  const computedRepo = db.dataSource.getRepository(ComputedGradelist);

  const records = await computedRepo
    .createQueryBuilder("computed")
    .leftJoinAndSelect("computed.student", "student")
    .orderBy("student.studentName", "ASC")
    .getMany();

  // Flatten the structure: merge computed + student fields into one object
  const studentdata = records.map((record) => ({
    studentName: record.student?.studentName || "",
    computedgradeid: record.computedgradeid,
    studentgradeid: record.studentgradeid,
    totalattendance: record.totalattendance,
    perfectattendancescore: record.perfectattendancescore,
    attendance10percent: record.attendance10percent,
    totalquiz: record.totalquiz,
    perfectquizscore: record.perfectquizscore,
    quiz15percent: record.quiz15percent,
    totalproject: record.totalproject,
    perfectprojectscore: record.perfectprojectscore,
    project30percent: record.project30percent,
    totalexam: record.totalexam,
    perfectexamscore: record.perfectexamscore,
    exam45percent: record.exam45percent,
    finalcomputedgrade: record.finalcomputedgrade,
    transmutedgrade: record.transmutedgrade,
  }));

  return studentdata;
}


}
