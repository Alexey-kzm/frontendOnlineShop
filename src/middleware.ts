import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./services/auth-token.service";

let lastUrl: string = "http://localhost:3000/";
const forbiddenNotLogins: string[] = ["/orders", "/cart/order"]

export function middleware(request: NextRequest) {
  // const isLogin = getAccessToken();
  // for (let forbiddenNotLogin of forbiddenNotLogins) {
  //   if (request.nextUrl.pathname === forbiddenNotLogin && !isLogin) {
  //     return NextResponse.redirect(new URL(lastUrl));
  //   }
  // }
  //
  // if (!request.nextUrl.pathname.includes("/_next/")) {
  //   lastUrl = request.url;
  // }
}
