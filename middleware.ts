import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;
  
  const signInRoutes = {
    admin: '/signin/admin',
    user: '/signin/user',
  };
  
  const roleRoutes = {
    0: '/admin',    
    1: '/sales/overview' 
  };
  
  const salesAllowedRoutes = [
    '/sales/overview',
    '/sales/leads'
  ];
  
  const isSignInRoute = Object.values(signInRoutes).includes(path);
  
  if (!session && !isSignInRoute) {
    return NextResponse.redirect(new URL(signInRoutes.user, req.url));
  }
  
  if (session) {
    //@ts-ignore
    const role: number = session.user?.role;
    
    if (role === 0) {
      if (!path.startsWith('/admin')) {
        return NextResponse.redirect(new URL(roleRoutes[0], req.url));
      }
    }
    
    if (role === 1) {
      const isAllowedSalesRoute = salesAllowedRoutes.some(
        allowedRoute => path === allowedRoute || path.startsWith(`${allowedRoute}/`)
      );
      
      if (!isAllowedSalesRoute) {
        return NextResponse.redirect(new URL(roleRoutes[1], req.url));
      }
    }
    
    if (role && path === '/signin') {
      //@ts-ignore
      if (role === 0) {
        return NextResponse.redirect(new URL(roleRoutes[0], req.url));
      }
      if (role === 1) {
        return NextResponse.redirect(new URL(salesAllowedRoutes[0], req.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};