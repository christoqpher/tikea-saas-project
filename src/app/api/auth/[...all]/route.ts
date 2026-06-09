import { handler } from "@/lib/auth-server";

// Maneja todas las rutas de Better Auth bajo /api/auth/* (vía Convex).
export const { GET, POST } = handler;
