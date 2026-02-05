import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccess } from "./lib/routes";

const matchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route],
}));

// Rute za autentifikaciju
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Root ruta
const isRootRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  const role =
    userId && sessionClaims?.metadata?.role
      ? sessionClaims.metadata.role
      : userId
      ? "patient"
      : null;

  // Ako je korisnik ulogovan i nalazi se na auth stranicama ili root, preusmeri ga
  if (userId && (isAuthRoute(req) || isRootRoute(req))) {
    const redirectRole = role || "patient";
    return NextResponse.redirect(new URL(`/${redirectRole}`, url.origin));
  }

  // Ako korisnik nije ulogovan i pokušava da pristupi zaštićenoj ruti
  const matchingRoute = matchers.find(({ matcher }) => matcher(req));
  
  if (matchingRoute && !userId) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }

  if (matchingRoute && !matchingRoute.allowedRoles.includes(role || "patient")) {
    // Redirect unauthorized roles to their respective default pages
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  // Continue if the user is authorized
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};