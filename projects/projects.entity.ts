import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Employee } from "../employees/employee.entity"; 

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ name: 'projectId' })
  projectId!: number;

  @Column()
  project_name!: string;

  @ManyToMany(() => Employee, (employee) => employee.projects)
  employees!: Employee[];
}
