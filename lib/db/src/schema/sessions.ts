import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";

export const sessionsTable = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id")
    .notNull()
    .references(() => studentsTable.id),
  level: integer("level").notNull(),
  score: integer("score").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  duration: integer("duration").notNull().default(0),
  problems: json("problems").notNull().default([]),
  hintsUsed: integer("hints_used").notNull().default(0),
  aiAdapt: json("ai_adapt"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
