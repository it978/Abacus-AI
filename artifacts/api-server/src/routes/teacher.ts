import { Router } from "express";
import type { IRouter } from "express";
import { db, usersTable, studentsTable, sessionsTable } from "@workspace/db";
import { eq, gte, and } from "drizzle-orm";
import { authMiddleware } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/v1/teacher/class", authMiddleware, async (req, res): Promise<void> => {
  const students = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.teacherId, req.user!.id));

  const profiles = await Promise.all(
    students.map(async (student) => {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, student.userId))
        .limit(1);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentSessions = await db
        .select()
        .from(sessionsTable)
        .where(
          and(
            eq(sessionsTable.studentId, student.id),
            gte(sessionsTable.createdAt, sevenDaysAgo)
          )
        );

      const weeklyAccuracy =
        recentSessions.length > 0
          ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
          : 0;

      const allSessions = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.studentId, student.id));

      return {
        id: student.id,
        name: user?.name ?? "Student",
        age: user?.age ?? null,
        level: student.level,
        xp: student.xp,
        streak: student.streak,
        lastActive: student.lastActive.toISOString(),
        weeklyAccuracy: Math.round(weeklyAccuracy * 100) / 100,
        totalSessions: allSessions.length,
      };
    })
  );

  res.json(profiles);
});

router.get("/v1/teacher/stats", authMiddleware, async (req, res): Promise<void> => {
  const students = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.teacherId, req.user!.id));

  if (students.length === 0) {
    res.json({
      totalStudents: 0,
      avgAccuracy: 0,
      avgLevel: 0,
      topPerformers: [],
      levelDistribution: [],
    });
    return;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let totalAccuracy = 0;
  let totalLevel = 0;
  const levelDistMap = new Map<number, number>();

  const studentProfiles = await Promise.all(
    students.map(async (student) => {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, student.userId))
        .limit(1);

      const recentSessions = await db
        .select()
        .from(sessionsTable)
        .where(
          and(
            eq(sessionsTable.studentId, student.id),
            gte(sessionsTable.createdAt, sevenDaysAgo)
          )
        );

      const weeklyAccuracy =
        recentSessions.length > 0
          ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
          : 0;

      const allSessions = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.studentId, student.id));

      totalAccuracy += weeklyAccuracy;
      totalLevel += student.level;
      levelDistMap.set(student.level, (levelDistMap.get(student.level) ?? 0) + 1);

      return {
        id: student.id,
        name: user?.name ?? "Student",
        age: user?.age ?? null,
        level: student.level,
        xp: student.xp,
        streak: student.streak,
        lastActive: student.lastActive.toISOString(),
        weeklyAccuracy: Math.round(weeklyAccuracy * 100) / 100,
        totalSessions: allSessions.length,
      };
    })
  );

  const topPerformers = [...studentProfiles]
    .sort((a, b) => b.weeklyAccuracy - a.weeklyAccuracy)
    .slice(0, 5);

  res.json({
    totalStudents: students.length,
    avgAccuracy: Math.round((totalAccuracy / students.length) * 100) / 100,
    avgLevel: Math.round((totalLevel / students.length) * 10) / 10,
    topPerformers,
    levelDistribution: Array.from(levelDistMap.entries()).map(([level, count]) => ({ level, count })),
  });
});

export default router;
