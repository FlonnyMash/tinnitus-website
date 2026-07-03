import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_LABEL,
  getAppwriteEndpoint,
  getAppwriteProjectId,
  getSessionCookieName,
} from "./config";

type AppwriteUser = {
  labels?: string[];
};

async function getUserFromSession(
  sessionSecret: string,
): Promise<AppwriteUser | null> {
  try {
    const response = await fetch(`${getAppwriteEndpoint()}/account`, {
      headers: {
        "X-Appwrite-Project": getAppwriteProjectId(),
        "X-Appwrite-Session": sessionSecret,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AppwriteUser;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const sessionSecret = request.cookies.get(getSessionCookieName())?.value;
  const user = sessionSecret ? await getUserFromSession(sessionSecret) : null;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isAdmin = user?.labels?.includes(ADMIN_LABEL) ?? false;

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
