import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { IUser, IUserTokenClaims } from "@/types/auth/user";
import { Db } from "mongodb";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";

type Parameters = {
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | { status: "error"; description: string }>
) {
  const body = req.body as Parameters;
  if (!req.body || !body.email || !body.password)
    return res
      .status(400)
      .json({
        status: "error",
        description:
          "Request body empty, make sure email & password is attached in the body",
      });
  if (!process.env.JWT_PRIVATE_KEY)
    return res
      .status(500)
      .json({ status: "error", description: "Signing key not found?" });
  const { db }: { db: Db } = await connectToDatabase();
  const user = await db
    .collection<IUser>("users")
    .findOne({ email: body.email });
  if (!user)
    return res
      .status(400)
      .json({ status: "error", description: "Invalid username or password" });
  if (!(await bcrypt.compare(body.password, user.password)))
    return res
      .status(400)
      .json({ status: "error", description: "Invalid username or password" });
  const token = await jwt.sign(
    {
      id: user.id,
      type: user.type,
    } as IUserTokenClaims,
    Buffer.from(process.env.JWT_PRIVATE_KEY as string, "base64").toString(
      "utf8"
    ),
    { algorithm: "ES512", expiresIn: "15d" }
  );
  setCookie("auth.user", token, {
    req,
    res,
    maxAge: 60 * 60 * 24 * 15 /* 15 day validity */,
  });
  res.status(200).json(Object.assign({}, user, { password: null }));
}
