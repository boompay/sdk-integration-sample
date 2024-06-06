import { Router, Request } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { TypedRequest } from "../types/request";

const prisma = new PrismaClient();
const router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Express server is running");
});

router.get("/me", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { BoomIntegration: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.post(
  "/users",
  async (req: TypedRequest<Prisma.UserCreateInput>, res) => {
    try {
      const { firstName, lastName, ssn, dob, phone, email, password } =
        req.body;
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          password,
          ssn,
          dob,
          phone,
          email,
        },
      });
      res.cookie("userId", user.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to create user" });
    }
  }
);

export default router;
