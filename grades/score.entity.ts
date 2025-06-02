import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Studentlist } from "../students/student.entity";
import { Gradelist } from "./gradelist.entity";

@Entity("scorelists")
export class Scorelist {
  @PrimaryGeneratedColumn()
  scoreid!: number;

  @Column()
  studentgradeid!: number;

  @Column()
  gradeid!: number;

  @Column({ nullable: true, default: "" })
  attendanceStatus!: string;

  @Column({ type: "int", nullable: true })
  score!: number;

  @Column({ default: true })
  active!: boolean;

  @ManyToOne(() => Studentlist, (student) => student.scores)
  @JoinColumn({ name: "studentgradeid" })
  student!: Studentlist;

  @ManyToOne(() => Gradelist, (grade) => grade.scores)
  @JoinColumn({ name: "gradeid" })
  grade!: Gradelist;

  // Notice we load the entire Gradelist entity here:
  //   @ManyToOne(() => Gradelist, (grade) => grade.scores, { eager: true })
  //   @JoinColumn({ name: "gradeid" })
  //   grade!: Gradelist;
}
