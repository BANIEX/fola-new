import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { IUser, IUserTokenClaims } from "@/types/auth/user";
import { Db } from "mongodb";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

type Parameters = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  number: string

};

export default async function handler(
  req: NextApiRequest,
  // The status property in this response is always being modified to "status:error". For some reason.
  res: NextApiResponse<IUser | { status: "error" | "success" ; description: string }>
) {
  const body = req.body as Parameters;
  // console.log(body);
  // console.log("hi")
  if (!req.body || !body.firstName || !body.lastName ||  !body.password || !body.email || !body.number || !body.gender || !body.password)
    return res.status(400).json({
      status: "error",
      description:
        "Request body incomplete. Kindly include necessary information",
    });
  const { db }: { db: Db } = await connectToDatabase();
  const user = await db
    .collection<IUser>("users")
    .findOne({ email: body.email });
  if (user){
    return res
      .status(400)
      .json({
        status: "error",
        description: "User already exists. Please proceed to Sign in.",
      });

  }
    

  const generatedId = v4();

  // console.log(user);

  const newUser = await db.collection<IUser>("users").insertOne({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    number: body.number,
    gender: body.gender,
    password: await bcrypt.hashSync(body.password, bcrypt.genSaltSync(10)),
    id: generatedId,
    cart: {
      products: [],
    },
    signins: [],
    orders: [],
    type: "user",
    
  });


  if(newUser){
    // console.log("new user block with details", newUser)
    res
      .status(200)
      .json({ status: "success", description: "Account created successfully. Proceed to Sign In." });

  }else{
    // console.log("New user should be empty cos it was not stored or somethin", newUser)
    res
      .status(400)
      .json({
        status: "error",
        description: "Error creating user account. Please try again later",
      });

  }


  // if(newUser)
  //     return res.status(200).json({status: "success", description: "Account created successfully"})



  // return res.status(400).json({status: "error", description: "Error creating user account. Please try again later"})

  // const token = await jwt.sign(
  //   {
  //     id: generatedId,
  //     type: "user",
  //   } as IUserTokenClaims,
  //   Buffer.from(process.env.JWT_PRIVATE_KEY, "base64").toString("utf8"),
  //   { algorithm: "ES512", expiresIn: "15d" }
  // );
  // setCookie("auth.user", token, {
  //   req,
  //   res,
  //   maxAge: 60 * 60 * 24 * 15 /* 15 day validity */,
  // });
  // res.status(200).json(Object.assign({}, user, { password: null }));




}
