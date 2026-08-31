import { NextRequest, NextResponse } from "next/server";
import { adminMiddleware } from "./middlewares/admin_middleware";
import { authMiddleware } from "./middlewares/auth_middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    authMiddleware(request);
    await adminMiddleware(request);
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
  matcher: ["/admin/:path*"],
};
