import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Scorelist } from "./score.entity";

@Entity("gradelists")
export class Gradelist {
  @PrimaryGeneratedColumn()
  gradeid!: number;

  @Column({ type: "date", nullable: true })
  attendanceDate!: string;

  @Column({ nullable: false })
  scoretype!: string;

  @Column({ type: "int", nullable: false })
  perfectscore!: number;
 

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => Scorelist, (scorelist) => scorelist.grade)
  scores!: Scorelist[];
}
