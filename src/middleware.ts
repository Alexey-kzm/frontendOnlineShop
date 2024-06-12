import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./services/auth-token.service";

let lastUrl: string = "http://localhost:3000/";
const forbiddenNotLogins: string[] = ["/orders", "/cart/order"]

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("https://frontendonlineshop.onrender.com/products?catalog=5,6,8,7,13,14,15,16,9,10,11,12,3,1,2,4"))
  }
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
