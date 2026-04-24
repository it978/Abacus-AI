import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import studentRouter from "./student";
import aiRouter from "./ai";
import subscriptionRouter from "./subscription";
import parentRouter from "./parent";
import teacherRouter from "./teacher";
import adminRouter from "./admin";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(studentRouter);
router.use(aiRouter);
router.use(subscriptionRouter);
router.use(parentRouter);
router.use(teacherRouter);
router.use(adminRouter);
router.use(leaderboardRouter);

export default router;
