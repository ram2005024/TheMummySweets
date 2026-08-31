import { adminMiddleware } from "@/middlewares/admin_middleware";
import { authMiddleware } from "@/middlewares/auth_middleware";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Run auth check first
  const authResult = authMiddleware(request);
  if (authResult instanceof Response) return authResult;

  // Then run admin check
  const adminResult = await adminMiddleware(request);
  if (adminResult instanceof Response) return adminResult;

  return adminResult;
}

export const config = {
  matcher: ["/admin/:path*"], // only admin routes later more will be added
};
