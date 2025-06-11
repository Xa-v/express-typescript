import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";


@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  status!: string;

}
