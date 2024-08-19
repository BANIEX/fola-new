import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/util/mongodb";
import { IUser, IUserTokenClaims } from "@/types/auth/user";
import { Db } from "mongodb";
import SendMail from "@/util/send-mail";
import titleCaseConverter from "@/util/title-case";

type Parameters = {
  email: string;
};

function generateRandomHash(length: number) {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  const hashArray = Array.from(randomBytes).map((byte) =>
    byte.toString(16).padStart(2, "0")
  );

  
  return hashArray.join("");  
}

const generateTOTP = (num = 6) => {
  return parseInt(Math.random().toFixed(num).substring(0, num));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | { status: "error" | "success"; description: string }>
) {
  console.log(req.body);
  console.log("forgot p ends");
  const body = req.body as Parameters;
  console.log(body);
  if (!req.body || !body.email)
    return res.status(400).json({
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
      .json({ status: "error", description: "User was not founsubjed." });

  const code = generateRandomHash(20);

  const saveUserCode = await db
    .collection<IUser>("users")
    .updateOne({ id: user.id }, { $set: { code: code, codeExpiresAt: Date.now() + 300000 } }); // 5 minutes expiration time

  if (!saveUserCode) {
    return res.status(400).json({
      status: "error",
      description: "Error occured when trying to save codex to database",
    });
  }
  const mailSenderFeedback = await SendMail({
    email: user.email,

    subject: `${titleCaseConverter(user.firstName)}, Trying to reset your password?`,

    html: `<p>Hello ${titleCaseConverter(user.firstName)},</p>
        <p>Follow this link to reset your Ranforte password for your ${
          user.email
        } account. </p>
        <p><a href='${process.env.BASE_URL}/auth/reset?code=${code}'>${
      process.env.BASE_URL
    }/auth/reset?code=${code}</a></p>
        <p>If you didn't ask to reset your password, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your Ranforte team</p>`,
  });

  if (mailSenderFeedback == "error sending email") {
    console.log("E-mail not sent mhen");
    return res.status(400).json({
      status: "error",
      description: "Error occured when trying to send forgot password mail",
    });
  } else {
    console.log("Email sent successfullly");
     return res.status(200).json({
       status: "success",
       description: "Email sent successfully",
     });
  }
  //   return res.redirect(
  //     "/v/Password Reset Link Sent!?d=Password reset magic link sent, check your inbox and follow the instructions"
  //   );
  return;
}
