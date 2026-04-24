import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const studentsTable = pgTable("students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActive: timestamp("last_active", { withTimezone: true })
    .notNull()
    .defaultNow(),
  parentId: text("parent_id").references(() => usersTable.id),
  teacherId: text("teacher_id").references(() => usersTable.id),
  badges: json("badges").$type<string[]>().notNull().default([]),
  sessionsToday: integer("sessions_today").notNull().default(0),
  sessionsResetAt: timestamp("sessions_reset_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({
  id: true,
  lastActive: true,
});
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
