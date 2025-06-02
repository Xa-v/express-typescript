import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Studentlist } from "../students/student.entity";

@Entity("computedgradelists")
export class ComputedGradelist {
  @PrimaryGeneratedColumn()
  computedgradeid!: number;

  @Column()
  studentgradeid!: number;

  @Column({ type: "int", default: 0 })
  totalattendance!: number;

  @Column({ type: "int", default: 0 })
  perfectattendancescore!: number;

  @Column({ type: "double", default: 0 })
  attendance10percent!: number;

  @Column({ type: "int", default: 0 })
  totalquiz!: number;

  @Column({ type: "int", default: 0 })
  perfectquizscore!: number;

  @Column({ type: "double", default: 0 })
  quiz15percent!: number;

  @Column({ type: "int", default: 0 })
  totalproject!: number;

  @Column({ type: "int", default: 0 })
  perfectprojectscore!: number;

  @Column({ type: "double", default: 0 })
  project30percent!: number;

  @Column({ type: "int", default: 0 })
  totalexam!: number;

  @Column({ type: "int", default: 0 })
  perfectexamscore!: number;

  @Column({ type: "double", default: 0 })
  exam45percent!: number;

  @Column({ type: "double", default: 0 })
  finalcomputedgrade!: number;

  @Column({ type: "decimal", precision: 2, scale: 1, default: 5.0 })
  transmutedgrade!: number;

  @ManyToOne(() => Studentlist, (student) => student.computedGrades)
  @JoinColumn({ name: "studentgradeid" })
  student!: Studentlist;
}
