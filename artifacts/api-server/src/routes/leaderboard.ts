import { Router } from "express";
import type { IRouter } from "express";
import { db, usersTable, studentsTable, sessionsTable } from "@workspace/db";
import { eq, desc, gte, and } from "drizzle-orm";
import { authMiddleware, requirePlan } from "../middlewares/auth";
import { GetLeaderboardQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/v1/leaderboard", authMiddleware, requirePlan("STAR"), async (req, res): Promise<void> => {
  const params = GetLeaderboardQueryParams.safeParse(req.query);
  const level = params.success ? params.data.level : undefined;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  let studentsQuery = db
    .select()
    .from(studentsTable);

  const allStudents = await studentsQuery;

  const entries = await Promise.all(
    allStudents.map(async (student) => {
      if (level !== undefined && student.level !== Number(level)) return null;

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
            gte(sessionsTable.createdAt, weekAgo)
          )
        );

      const weeklyAccuracy =
        recentSessions.length > 0
          ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
          : 0;

      const weeklyXp = recentSessions.reduce((sum, s) => sum + s.score * 10, 0);

      return {
        studentId: student.id,
        name: user?.name ?? "Student",
        xp: weeklyXp,
        accuracy: Math.round(weeklyAccuracy * 100) / 100,
        streak: student.streak,
        level: student.level,
      };
    })
  );

  const filtered = entries.filter(Boolean) as NonNullable<typeof entries[0]>[];
  const sorted = filtered
    .sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy)
    .slice(0, 10)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  res.json(sorted);
});

export default router;
