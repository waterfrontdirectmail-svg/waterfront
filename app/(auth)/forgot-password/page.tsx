"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z.object({
  email: z.email("Please enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Card className="auth-form">
        <CardHeader>
          <CardTitle className="text-center" style={{ color: "#0f1b3d" }}>
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-600">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="auth-form">
      <CardHeader>
        <CardTitle className="text-center" style={{ color: "#0f1b3d" }}>
          Reset Password
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <p className="text-sm text-slate-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ backgroundColor: "#0f1b3d" }}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </Button>
          <Link href="/login" className="text-sm text-blue-600 hover:underline text-center">
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
