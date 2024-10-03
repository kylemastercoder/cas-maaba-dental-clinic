import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude the sign-in page from protection
  if (pathname.startsWith("/sign-in")) {
    return NextResponse.next();
  }

  // Check for the Authorization cookie
  const cookie = cookies().get("Authorization");
  if (!cookie) {
    // Redirect to sign-in page if no cookie is present
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const jwt = cookie.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    // Verify the JWT
    const { payload } = await jose.jwtVerify(jwt, secret, {});
    console.log(payload); // You can remove this in production
    return NextResponse.next(); // Proceed if valid
  } catch (err) {
    console.log("Invalid token:", err);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// Config: Match routes excluding Next.js internals, static files, and protect API routes
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Include the sign-in page specifically
    "/sign-in",
  ],
};
