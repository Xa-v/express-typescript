import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "../employees/employee.entity";
import { Department } from "../departments/department.entity";
import { Project } from "../projects/projects.entity";
import path from "path";

// Define an interface for the database object
interface Db {
  dataSource: DataSource;
}

export const db: Db = {
  dataSource: {} as DataSource,
};

export async function initializeDb() {
  // Build the TypeORM configuration object for SQLite
  const typeOrmConfig = {
    type: "sqlite" as const,
   database: path.join(process.cwd(), "db.sqlite"), // or "./db.sqlite"
    synchronize: true, // Auto-sync schema (good for dev)
    logging: true,
    entities: [Employee, Department, Project],
  };

  try {
    const dataSource = new DataSource(typeOrmConfig);
    await dataSource.initialize();
    console.log("SQLite DataSource has been initialized");

    db.dataSource = dataSource;

    // Insert default departments if not exist
    const departmentRepository = dataSource.getRepository(Department);
    const count = await departmentRepository.count();
    if (count === 0) {
      await departmentRepository.insert([
        { id: 1, name: "Engineering" },
        { id: 2, name: "Tambay" },
      ]);
      console.log("Default departments inserted.");
    } else {
      console.log("Departments already exist.");
    }
  } catch (err) {
    console.error("Error initializing SQLite DataSource:", err);
    throw err;
  }
}
