import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session: any = await auth();
  
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
  
  // Check if session and user exist
  if (!session?.user && !isSignInRoute) {
    return NextResponse.redirect(new URL(signInRoutes.user, req.url));
  }
  
  if (session?.user) {
    // Safely access role
    const role = session.user.role;
    
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
    
    // Redirect from signin page based on role
    if (role !== undefined && path === '/signin') {
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