import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Шукаємо нашу куку
  const token = request.cookies.get("local_access_token_p")?.value;

  // Якщо користувач намагається зайти на /diagrams без токена
  if (!token && request.nextUrl.pathname.startsWith("/diagrams")) {
    // Перекидаємо його на головну сторінку (реєстрація/вхід)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Якщо є токен або маршрут дозволений — пропускаємо далі
  return NextResponse.next();
}

// Вказуємо, для яких сторінок має спрацьовувати цей захист
export const config = {
  matcher: ["/diagrams/:path*"],
};
