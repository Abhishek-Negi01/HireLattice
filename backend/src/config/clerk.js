import { clerkMiddleware } from "@clerk/express";

// Attaches auth() to every request — use requireAuth() on protected routes
export default clerkMiddleware();
