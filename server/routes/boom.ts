import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import axios from "axios";

const db = new PrismaClient();
const router = Router();

router.get("/token", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        BoomIntegration: {
          select: {
            authToken: true,
          },
        },
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.BoomIntegration?.authToken || null);
  } catch (err) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});

router.post("/create_boom_link_token", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { BoomIntegration: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.BoomIntegration?.authToken)
      return res.status(404).json({ error: "User already exists" });

    // Auth token has ttl of 30 mins
    const { auth_token } = await axios
      .post(process.env.BOOM_API_URL + "/partner/v1/authenticate", {
        access_key: process.env.BOOM_ACCESS_KEY,
        secret_key: process.env.BOOM_SECRET_KEY,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log({
          access_key: process.env.BOOM_ACCESS_KEY,
          secret_key: process.env.BOOM_SECRET_KEY,
        });
        // console.log(err.message);
        return null;
      });

    if (!auth_token)
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Boom" });

    const boomCustomerPayload: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      dob?: string;
      ssn?: string;
    } = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
    };
    if (user.dob)
      boomCustomerPayload["dob"] = user.dob.toISOString().split("T")[0];
    if (user.ssn) boomCustomerPayload["ssn"] = user.ssn;

    const { id: boomId, access_key } = await axios
      .post(
        process.env.BOOM_API_URL + "/partner/v1/customers",
        boomCustomerPayload,
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        }
      )
      .then(
        (res: {
          data: {
            id: string;
            first_name: string;
            last_name: string;
            phone: string;
            email: string;
            dob: string | null;
            access_key: string;
          };
        }) => res.data
      );

    await db.boomIntegration.create({
      data: {
        user: { connect: { id: userId } },
        authToken: access_key,
        boomId,
      },
    });

    res.status(200).json(access_key);
  } catch (err) {
    console.dir(err);
    res.status(500).json({ error: "Failed to exchange public token" });
  }
});

export default router;
