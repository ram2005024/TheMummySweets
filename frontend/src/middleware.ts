import { NextRequest, NextResponse } from "next/server";
import { adminMiddleware } from "./middlewares/admin_middleware";
import { authMiddleware } from "./middlewares/auth_middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const authResult = authMiddleware(request);
    if (authResult instanceof NextResponse) return authResult;
    const adminResult = await adminMiddleware(request);
    if (adminResult instanceof NextResponse) return adminResult;

    return NextResponse.next();
  }
  //   if (pathname.startsWith("/dashboard")) {
  //     const authResult = authMiddleware(request);
  //     if (authResult instanceof NextResponse) return authResult;
  //     return NextResponse.next();
  //   }
  return NextResponse.next();
}

// Configure which routes middleware applies to
export const config = {
  matchers: ["/admin/:path*"],
};
