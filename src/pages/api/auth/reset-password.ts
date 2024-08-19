import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { IUser, IUserTokenClaims } from "@/types/auth/user";
import { Db } from "mongodb";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";

type Parameters = {
  code: string;
  newPassword: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | { status: "error" | "success"; description: string }>
) {
  const body = req.body as Parameters;
  console.log("body.code", body.code)
  if (!req.body || !body.newPassword || !body.code)
    return res
      .status(400)
      .json({
        status: "error",
        description:
          "Request body empty, make sure email & password is attached in the body",
      });
  const { db }: { db: Db } = await connectToDatabase();
  const user = await db.collection<IUser>("users").findOne({ code: body.code });
  if (!user)
    return res
      .status(400)
      .json({ status: "error", description: "User not found" });
  
  if(user && user.codeExpiresAt){

    if(Date.now() > user.codeExpiresAt){
      return res
        .status(400)
        .json({ status: "error", description: "Invalid or expired reset code" });

    }

  }




 let passwordUpdateFeedbback = await db
    .collection<IUser>("users")
    .updateOne(
      { id: user.id },
      {
        $set: {
          code: "",
          codeExpiresAt: 0,
          password: await bcrypt.hashSync(
            body.newPassword,
            bcrypt.genSaltSync(10)
          ),
        },
      }
    );

  
  if(passwordUpdateFeedbback){
    return res
        .status(200)
        .json({ status: "success", description: "Successfully updated proceed. May procced to sign in" });

  }


  return res
    .status(400)
    .json({ status: "error", description: "Error changing password. Try again later" });




  // const token = await jwt.sign(
  //   {
  //     id: user.id,
  //     type: user.type,
  //   } as IUserTokenClaims,
  //   Buffer.from(process.env.JWT_PRIVATE_KEY as string, "base64").toString(
  //     "utf8"
  //   ),
  //   { algorithm: "ES512", expiresIn: "15d" }
  // );
  // setCookie("auth.user", token, {
  //   req,
  //   res,
  //   maxAge: 60 * 60 * 24 * 15 /* 15 day validity */,
  // });
  // res.status(200).json(Object.assign({}, user, { password: null }));
}
