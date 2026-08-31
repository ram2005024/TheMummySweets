import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function adminMiddleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh")?.value;
  if (!refreshToken) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(refreshToken, secret);
    console.log(payload);
    if (payload.role !== "admin") {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
}
