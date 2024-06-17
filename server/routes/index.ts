import "dotenv/config";
import { Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { TypedRequest } from "../types/request";

const db = new PrismaClient();
const router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Express server is running");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findFirst({
    where: { email, password },
  });
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.cookie("userId", user.id);
  res.status(200).json(user);
});

router.post("/logout", async (req, res) => {
  res.clearCookie("userId");
  res.status(200).json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { BoomIntegration: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

router.post(
  "/users",
  async (req: TypedRequest<Prisma.UserCreateInput>, res) => {
    try {
      const { firstName, lastName, ssn, dob, phone, email, password } =
        req.body;
      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          // not hashing since this is a demo
          password,
          ssn,
          dob: new Date(dob).toISOString(),
          phone,
          email,
        },
        include: { BoomIntegration: true },
      });
      res.cookie("userId", user.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to create user" });
    }
  }
);

export default router;
