"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

export async function login(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminToken(password)) {
    // Deliberately vague; do not reveal whether a token is configured.
    return "Incorrect password.";
  }
  (await cookies()).set(ADMIN_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect("/admin/registrations");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/registrations");
}
