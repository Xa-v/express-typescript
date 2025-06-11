import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1748918050430 implements MigrationInterface {
    name = 'Init1748918050430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gradelists" ("gradeid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "attendanceDate" date, "scoretype" varchar NOT NULL, "perfectscore" integer NOT NULL, "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "scorelists" ("scoreid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "gradeid" integer NOT NULL, "attendanceStatus" varchar DEFAULT (''), "score" integer, "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "computedgradelists" ("computedgradeid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "totalattendance" integer NOT NULL DEFAULT (0), "perfectattendancescore" integer NOT NULL DEFAULT (0), "attendance10percent" double NOT NULL DEFAULT (0), "totalquiz" integer NOT NULL DEFAULT (0), "perfectquizscore" integer NOT NULL DEFAULT (0), "quiz15percent" double NOT NULL DEFAULT (0), "totalproject" integer NOT NULL DEFAULT (0), "perfectprojectscore" integer NOT NULL DEFAULT (0), "project30percent" double NOT NULL DEFAULT (0), "totalexam" integer NOT NULL DEFAULT (0), "perfectexamscore" integer NOT NULL DEFAULT (0), "exam45percent" double NOT NULL DEFAULT (0), "finalcomputedgrade" double NOT NULL DEFAULT (0), "transmutedgrade" decimal(2,1) NOT NULL DEFAULT (5))`);
        await queryRunner.query(`CREATE TABLE "studentlists" ("studentgradeid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentName" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_scorelists" ("scoreid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "gradeid" integer NOT NULL, "attendanceStatus" varchar DEFAULT (''), "score" integer, "active" boolean NOT NULL DEFAULT (1), CONSTRAINT "FK_8efca9c9a4f6c17e6a1e9c268cb" FOREIGN KEY ("studentgradeid") REFERENCES "studentlists" ("studentgradeid") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e786ec787bc670ed5f050059177" FOREIGN KEY ("gradeid") REFERENCES "gradelists" ("gradeid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_scorelists"("scoreid", "studentgradeid", "gradeid", "attendanceStatus", "score", "active") SELECT "scoreid", "studentgradeid", "gradeid", "attendanceStatus", "score", "active" FROM "scorelists"`);
        await queryRunner.query(`DROP TABLE "scorelists"`);
        await queryRunner.query(`ALTER TABLE "temporary_scorelists" RENAME TO "scorelists"`);
        await queryRunner.query(`CREATE TABLE "temporary_computedgradelists" ("computedgradeid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "totalattendance" integer NOT NULL DEFAULT (0), "perfectattendancescore" integer NOT NULL DEFAULT (0), "attendance10percent" double NOT NULL DEFAULT (0), "totalquiz" integer NOT NULL DEFAULT (0), "perfectquizscore" integer NOT NULL DEFAULT (0), "quiz15percent" double NOT NULL DEFAULT (0), "totalproject" integer NOT NULL DEFAULT (0), "perfectprojectscore" integer NOT NULL DEFAULT (0), "project30percent" double NOT NULL DEFAULT (0), "totalexam" integer NOT NULL DEFAULT (0), "perfectexamscore" integer NOT NULL DEFAULT (0), "exam45percent" double NOT NULL DEFAULT (0), "finalcomputedgrade" double NOT NULL DEFAULT (0), "transmutedgrade" decimal(2,1) NOT NULL DEFAULT (5), CONSTRAINT "FK_84dc4bd312c97c6a8a3ec016c6e" FOREIGN KEY ("studentgradeid") REFERENCES "studentlists" ("studentgradeid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_computedgradelists"("computedgradeid", "studentgradeid", "totalattendance", "perfectattendancescore", "attendance10percent", "totalquiz", "perfectquizscore", "quiz15percent", "totalproject", "perfectprojectscore", "project30percent", "totalexam", "perfectexamscore", "exam45percent", "finalcomputedgrade", "transmutedgrade") SELECT "computedgradeid", "studentgradeid", "totalattendance", "perfectattendancescore", "attendance10percent", "totalquiz", "perfectquizscore", "quiz15percent", "totalproject", "perfectprojectscore", "project30percent", "totalexam", "perfectexamscore", "exam45percent", "finalcomputedgrade", "transmutedgrade" FROM "computedgradelists"`);
        await queryRunner.query(`DROP TABLE "computedgradelists"`);
        await queryRunner.query(`ALTER TABLE "temporary_computedgradelists" RENAME TO "computedgradelists"`);
       await queryRunner.query(`CREATE TABLE "attendance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar NOT NULL)`);
       await queryRunner.query(`INSERT INTO "attendance" ("status") VALUES ('Present'), ('Absent'), ('Late'), ('Excused')`);
         await queryRunner.query(`INSERT INTO "studentlists" ("studentName") VALUES ('Math'), ('Mae'), ('Flute'), ('PL')`);
         await queryRunner.query(`INSERT INTO "computedgradelists" ("studentgradeid") SELECT "studentgradeid" FROM "studentlists" WHERE "studentName" IN ('Math', 'Mae', 'Flute', 'PL');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "computedgradelists" RENAME TO "temporary_computedgradelists"`);
        await queryRunner.query(`CREATE TABLE "computedgradelists" ("computedgradeid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "totalattendance" integer NOT NULL DEFAULT (0), "perfectattendancescore" integer NOT NULL DEFAULT (0), "attendance10percent" double NOT NULL DEFAULT (0), "totalquiz" integer NOT NULL DEFAULT (0), "perfectquizscore" integer NOT NULL DEFAULT (0), "quiz15percent" double NOT NULL DEFAULT (0), "totalproject" integer NOT NULL DEFAULT (0), "perfectprojectscore" integer NOT NULL DEFAULT (0), "project30percent" double NOT NULL DEFAULT (0), "totalexam" integer NOT NULL DEFAULT (0), "perfectexamscore" integer NOT NULL DEFAULT (0), "exam45percent" double NOT NULL DEFAULT (0), "finalcomputedgrade" double NOT NULL DEFAULT (0), "transmutedgrade" decimal(2,1) NOT NULL DEFAULT (5))`);
        await queryRunner.query(`INSERT INTO "computedgradelists"("computedgradeid", "studentgradeid", "totalattendance", "perfectattendancescore", "attendance10percent", "totalquiz", "perfectquizscore", "quiz15percent", "totalproject", "perfectprojectscore", "project30percent", "totalexam", "perfectexamscore", "exam45percent", "finalcomputedgrade", "transmutedgrade") SELECT "computedgradeid", "studentgradeid", "totalattendance", "perfectattendancescore", "attendance10percent", "totalquiz", "perfectquizscore", "quiz15percent", "totalproject", "perfectprojectscore", "project30percent", "totalexam", "perfectexamscore", "exam45percent", "finalcomputedgrade", "transmutedgrade" FROM "temporary_computedgradelists"`);
        await queryRunner.query(`DROP TABLE "temporary_computedgradelists"`);
        await queryRunner.query(`ALTER TABLE "scorelists" RENAME TO "temporary_scorelists"`);
        await queryRunner.query(`CREATE TABLE "scorelists" ("scoreid" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentgradeid" integer NOT NULL, "gradeid" integer NOT NULL, "attendanceStatus" varchar DEFAULT (''), "score" integer, "active" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "scorelists"("scoreid", "studentgradeid", "gradeid", "attendanceStatus", "score", "active") SELECT "scoreid", "studentgradeid", "gradeid", "attendanceStatus", "score", "active" FROM "temporary_scorelists"`);
        await queryRunner.query(`DROP TABLE "temporary_scorelists"`);
        await queryRunner.query(`DROP TABLE "studentlists"`);
        await queryRunner.query(`DROP TABLE "computedgradelists"`);
        await queryRunner.query(`DROP TABLE "scorelists"`);
        await queryRunner.query(`DROP TABLE "gradelists"`);
         await queryRunner.query(`DROP TABLE "attendance"`);
    }

}
