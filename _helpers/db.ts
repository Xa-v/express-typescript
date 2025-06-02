import "reflect-metadata";
import { DataSource } from "typeorm";
import { Studentlist } from "../students/student.entity";
import { Gradelist } from "../grades/gradelist.entity";
import { Scorelist } from "../grades/score.entity";
import { ComputedGradelist } from "../grades/computedgrade.entity";
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
    entities: [Studentlist, Gradelist, Scorelist, ComputedGradelist],
  };

  try {
    const dataSource = new DataSource(typeOrmConfig);
    await dataSource.initialize();
    console.log("SQLite DataSource has been initialized");

    db.dataSource = dataSource;
  } catch (err) {
    console.error("Error initializing SQLite DataSource:", err);
    throw err;
  }
}
