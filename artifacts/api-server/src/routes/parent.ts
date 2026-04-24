import { Router } from "express";
import type { IRouter } from "express";
import { db, usersTable, studentsTable, sessionsTable, reportsTable } from "@workspace/db";
import { eq, desc, gte, and } from "drizzle-orm";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { GetChildProgressParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/v1/parent/children", authMiddleware, async (req, res): Promise<void> => {
  const children = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.parentId, req.user!.id));

  const profiles = await Promise.all(
    children.map(async (child) => {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, child.userId))
        .limit(1);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentSessions = await db
        .select()
        .from(sessionsTable)
        .where(
          and(
            eq(sessionsTable.studentId, child.id),
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
        .where(eq(sessionsTable.studentId, child.id));

      return {
        id: child.id,
        name: user?.name ?? "Child",
        age: user?.age ?? null,
        level: child.level,
        xp: child.xp,
        streak: child.streak,
        lastActive: child.lastActive.toISOString(),
        weeklyAccuracy: Math.round(weeklyAccuracy * 100) / 100,
        totalSessions: allSessions.length,
      };
    })
  );

  res.json(profiles);
});

router.get("/v1/parent/child/:childId/progress", authMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.childId)
    ? req.params.childId[0]
    : req.params.childId;
  const params = GetChildProgressParams.safeParse({ childId: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { childId } = params.data;

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.id, childId))
    .limit(1);

  if (!student) {
    res.status(404).json({ error: "Child not found" });
    return;
  }

  const allSessions = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.studentId, childId))
    .orderBy(desc(sessionsTable.createdAt));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSessions = allSessions.filter((s) => s.createdAt >= thirtyDaysAgo);

  const dailyMap = new Map<string, { accuracy: number[]; sessions: number }>();
  for (const session of recentSessions) {
    const date = session.createdAt.toISOString().split("T")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { accuracy: [], sessions: 0 });
    }
    const entry = dailyMap.get(date)!;
    entry.accuracy.push(session.accuracy);
    entry.sessions += 1;
  }

  const dailyAccuracy = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      accuracy: Math.round((data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length) * 100) / 100,
      sessions: data.sessions,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const levelMap = new Map<number, { sessions: number; accuracy: number[] }>();
  for (const session of allSessions) {
    if (!levelMap.has(session.level)) {
      levelMap.set(session.level, { sessions: 0, accuracy: [] });
    }
    const entry = levelMap.get(session.level)!;
    entry.sessions += 1;
    entry.accuracy.push(session.accuracy);
  }

  const levelProgress = Array.from(levelMap.entries()).map(([level, data]) => ({
    level,
    sessionsCompleted: data.sessions,
    avgAccuracy: Math.round((data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length) * 100) / 100,
  }));

  const totalSessions = allSessions.length;
  const avgAccuracy = totalSessions > 0
    ? Math.round((allSessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions) * 100) / 100
    : 0;

  res.json({
    dailyAccuracy,
    levelProgress,
    totalSessions,
    avgAccuracy,
    avgDuration: totalSessions > 0
      ? Math.round(allSessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions)
      : 0,
    hintsUsedTotal: allSessions.reduce((sum, s) => sum + s.hintsUsed, 0),
    strongAreas: ["Addition"],
    weakAreas: ["Multi-digit Operations"],
  });
});

router.get("/v1/parent/reports", authMiddleware, async (req, res): Promise<void> => {
  const children = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.parentId, req.user!.id));

  const allReports = await Promise.all(
    children.map(async (child) => {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, child.userId))
        .limit(1);

      const reports = await db
        .select()
        .from(reportsTable)
        .where(eq(reportsTable.studentId, child.id))
        .orderBy(desc(reportsTable.createdAt))
        .limit(5);

      return reports.map((r) => ({
        id: r.id,
        studentName: user?.name ?? "Child",
        htmlContent: r.htmlContent,
        weekOf: r.weekOf.toISOString(),
        createdAt: r.createdAt.toISOString(),
      }));
    })
  );

  res.json(allReports.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

export default router;
