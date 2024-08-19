import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { IUserTokenClaims } from "@/types/auth/user";


export async function middleware(request: NextRequest) {
  const userJWT = request.cookies.get("auth.user")?.value;
  if (
    /^\/(auth\/login|auth\/iforgot|auth\/reset|api\/auth\/forgot-password|about|products|auth\/onboard|auth\/logout|static|static\/|static\/[^\/]+|product\/[^\/]+|v\/[^\/]+)?$/.test(
      new URL(request.url).pathname
    )
  )
    return;
  console.log("didnt match");
  if (!userJWT)
    return NextResponse.redirect(
      new URL("/auth/login?e=no-token&r=" + request.url, request.url)
    );
  if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY)
    throw new Error("ECDSA Key does not exist?");
  try {
    const decoded = (
      await jose
        .jwtVerify(
          userJWT,
          await jose.importSPKI(
            Buffer.from(
              process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY,
              "base64"
            ).toString("utf8"),
            "ES512"
          )
        )
        .catch((e) => ({ payload: -1 }))
    ).payload as unknown as IUserTokenClaims | number;
    //await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
    if (typeof decoded === "number" && decoded === -1)
      throw new Error("Token could not be decoded.");
    if (decoded.type === "user" || decoded.type === "admin")
      return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(
      new URL("/auth/login?e=" + e.message, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
