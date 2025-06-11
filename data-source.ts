import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { Studentlist } from "./students/student.entity";
import { Gradelist } from "./grades/gradelist.entity";
import { Scorelist } from "./grades/score.entity";
import { ComputedGradelist } from "./grades/computedgrade.entity";
import { Attendance } from "./grades/attendance.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "db.sqlite"),
  synchronize: false,
  logging: true,
  entities: [Studentlist, Gradelist, Scorelist, ComputedGradelist, Attendance],
  migrations: [path.resolve(__dirname, "migrations") + "/*.ts"],
});

