import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,CreateDateColumn } from 'typeorm';
import { Department } from '../departments/department.entity';
import { Project } from "../projects/projects.entity"; 

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;
 
  @Column()
  name!: string;

  @Column()
  position!: string;

  @Column({nullable: true})
  salary!: number;

  @ManyToOne(() => Department)
  department!: Department;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  hireDate!: Date;

  @ManyToOne(() => Project)
  projects!: Project[];
}
