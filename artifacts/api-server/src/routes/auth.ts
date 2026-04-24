import { Router } from "express";
import type { IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, subscriptionsTable, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, createToken } from "../middlewares/auth";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/v1/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, role, age } = parsed.data;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      role: role as "STUDENT" | "PARENT" | "TEACHER",
      age: age ?? null,
    })
    .returning();

  await db.insert(subscriptionsTable).values({
    userId: user.id,
    plan: "FREE",
    status: "ACTIVE",
  });

  if (role === "STUDENT") {
    await db.insert(studentsTable).values({
      userId: user.id,
      level: 1,
      xp: 0,
      streak: 0,
    });
  }

  const token = createToken(user.id);

  const subscription = { plan: "FREE" as const, status: "ACTIVE" as const, startDate: new Date().toISOString(), endDate: null };

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age ?? null,
      avatar: user.avatar ?? null,
      createdAt: user.createdAt.toISOString(),
      subscription,
    },
  });
});

router.post("/v1/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user || !user.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const [subscription] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, user.id))
    .limit(1);

  if (!subscription) {
    await db.insert(subscriptionsTable).values({
      userId: user.id,
      plan: "FREE",
      status: "ACTIVE",
    });
  }

  const token = createToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age ?? null,
      avatar: user.avatar ?? null,
      createdAt: user.createdAt.toISOString(),
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            startDate: subscription.startDate.toISOString(),
            endDate: subscription.endDate?.toISOString() ?? null,
          }
        : { plan: "FREE", status: "ACTIVE", startDate: new Date().toISOString(), endDate: null },
    },
  });
});

router.get("/v1/auth/me", authMiddleware, async (req, res): Promise<void> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.id))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const [subscription] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, user.id))
    .limit(1);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    age: user.age ?? null,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt.toISOString(),
    subscription: subscription
      ? {
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate?.toISOString() ?? null,
        }
      : { plan: "FREE", status: "ACTIVE", startDate: new Date().toISOString(), endDate: null },
  });
});

export default router;
