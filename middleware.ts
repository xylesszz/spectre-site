import { NextResponse } from 'serverless';
import type { NextRequest } from 'serverless';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Rate limiting simples (por IP)
  const ip = request.ip || 'unknown';
  const rateLimitKey = `rate:${ip}`;
  
  // Implementar com Redis/Upstash se necessário

  return response;
}

export const config = {
  matcher: ['/api/:path*']
};