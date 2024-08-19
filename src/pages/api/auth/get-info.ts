import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { IUser, IUserTokenClaims } from "@/types/auth/user";
import { Db } from "mongodb";
import jwt from "jsonwebtoken";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    IUser | { status: "error" | "valid"; description: string; [x: string]: any }
  >
) {
  const userJWT = getCookie("auth.user", { req, res });
  if (!userJWT)
    return res
      .status(400)
      .json({ status: "error", description: "No token attached to request" });
  if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY)
    throw new Error("ECDSA Key does not exist?");
  try {
    const decoded = (await jwt.verify(
      userJWT,
      Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, "base64").toString(
        "utf8"
      ),
      { algorithms: ["ES512"] }
    )) as unknown as IUserTokenClaims;
    if (typeof decoded === "string")
      throw new Error("Token could not be decoded.");
    const { db }: { db: Db } = await connectToDatabase();
    const user = await db
      .collection<IUser>("users")
      .findOne({ id: decoded.id });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", description: "User was not found." });
    res
      .status(200)
      .json({
        status: "valid",
        description: "User found",
        u: Object.assign({}, user, { password: undefined }),
      });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "error", description: "Error Authenticating" });
  }
}
