import { Studentlist } from './student.entity';
import { Gradelist } from "../grades/gradelist.entity";
import { Scorelist } from "../grades/score.entity";
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

    return savedStudent;
  }


  //DELETE STUDENT
    async deleteById(studentgradeid: number) {
    const studentRepo = db.dataSource.getRepository(Studentlist);

    // Check if student exists
    const student = await studentRepo.findOne({ where: { studentgradeid } });
    if (!student) {
      throw new Error("Student not found.");
    }

    // Delete student
    await studentRepo.remove(student);
    return { message: "Student deleted successfully." };
  }



}
