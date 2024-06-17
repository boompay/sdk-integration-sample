import "dotenv/config";
import {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
  LinkTokenCreateRequest,
  CountryCode,
  ProcessorTokenCreateRequest,
} from "plaid";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { TypedRequest } from "../types/request";
import axios from "axios";

const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const db = new PrismaClient();
const plaidClient = new PlaidApi(configuration);
const router = Router();

router.post("/create_link_token", async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: user.id,
      },
      client_name: "Plaid Quickstart",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    if (PLAID_REDIRECT_URI) configs.redirect_uri = PLAID_REDIRECT_URI;
    if (PLAID_ANDROID_PACKAGE_NAME)
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    res.status(200).json(createTokenResponse.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create link token" });
  }
});

router.post(
  "/exchange_public_token",
  async (
    req: TypedRequest<{
      publicToken: string;
      accountId: string;
    }>,
    res
  ) => {
    try {
      const userId = req.cookies.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { BoomIntegration: true },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      const { publicToken, accountId } = req.body;
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        client_id: process.env.PLAID_CLIENT_ID || "",
        secret: process.env.PLAID_SECRET || "",
        public_token: publicToken,
      });
      const { item_id, access_token } = tokenResponse.data;

      const request: ProcessorTokenCreateRequest = {
        access_token,
        // Not sure if this is supposed to be publicToken.
        // https://plaid.com/docs/api/processors/#processor-token-create-request-access-token
        account_id: accountId || "",
        secret: process.env.PLAID_SECRET || "",
        client_id: process.env.PLAID_CLIENT_ID || "",
        // @ts-ignore
        processor: "boom",
      };
      const processorTokenResponse = await plaidClient.processorTokenCreate(
        request
      );

      const { processor_token } = processorTokenResponse.data;

      console.log("Processor token: ", processorTokenResponse.data);
      const { auth_token } = await axios
        .post(process.env.BOOM_API_URL + "/partner/v1/authenticate", {
          access_key: process.env.BOOM_ACCESS_KEY,
          secret_key: process.env.BOOM_SECRET_KEY,
        })
        .then((res) => res.data);
      if (!auth_token)
        return res
          .status(500)
          .json({ error: "Failed to authenticate with Boom" });

      // It returns boom customer
      await axios.post(
        process.env.BOOM_API_URL +
          `/partner/v1/customers/${user.BoomIntegration?.boomId}/partner/plaid/link`,
        {
          processor_token,
        },
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        }
      );

      res.status(200).json(item_id);
    } catch (err) {
      // console.dir(err);
      res.status(500).json({ error: JSON.stringify(err) });
    }
  }
);

export default router;
