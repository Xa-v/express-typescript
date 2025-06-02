import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Scorelist } from "../grades/score.entity";
import { ComputedGradelist } from "../grades/computedgrade.entity";

@Entity("studentlists")
export class Studentlist {
  @PrimaryGeneratedColumn()
  studentgradeid!: number;

  @Column({ nullable: true })
  studentName!: string;

  @OneToMany(() => Scorelist, (scorelist) => scorelist.student)
  scores!: Scorelist[];

  @OneToMany(() => ComputedGradelist, (computed) => computed.student)
  computedGrades!: ComputedGradelist[];
}
