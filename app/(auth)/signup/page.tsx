"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  company_name: z.string().min(1, "Company name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

const STEPS = [
  { label: "About You", icon: User, fields: ["full_name", "company_name"] as const },
  { label: "Contact", icon: Mail, fields: ["email", "phone"] as const },
  { label: "Security", icon: Lock, fields: ["password"] as const },
];

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: SignupValues) {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          company_name: data.company_name,
          phone: data.phone,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If session exists, email confirmation is disabled - go straight to dashboard
    if (authData?.session) {
      router.push("/dashboard");
    } else {
      router.push("/verify");
    }
  }

  async function handleNext() {
    const currentFields = STEPS[step].fields;
    const valid = await trigger(currentFields as unknown as (keyof SignupValues)[]);
    if (valid) {
      setError(null);
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setError(null);
    setStep((s) => s - 1);
  }

  return (
    <Card className="auth-form overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg" style={{ color: "#0f1b3d" }}>
          Create Account
        </CardTitle>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-4">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-center gap-1">
                <div
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    i <= step ? "bg-[#1B2A4A]" : "bg-slate-200"
                  }`}
                />
              </div>
              <div className="flex items-center gap-1">
                <s.icon
                  className={`w-3 h-3 transition-colors ${
                    i <= step ? "text-[#1B2A4A]" : "text-slate-300"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    i <= step ? "text-[#1B2A4A]" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Step 1: About You */}
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="John Smith"
                  autoFocus
                  {...register("full_name")}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  placeholder="Acme Marine Services"
                  {...register("company_name")}
                />
                {errors.company_name && (
                  <p className="text-sm text-red-500">{errors.company_name.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoFocus
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(561) 555-0123"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  autoFocus
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <p className="text-xs text-slate-400">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex w-full gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                className="flex-1 flex items-center justify-center gap-1"
                onClick={handleNext}
                style={{ backgroundColor: "#1B2A4A" }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
                style={{ backgroundColor: "#C9A84C", color: "#1B2A4A" }}
              >
                {loading ? "Creating account…" : "Create Account"}
              </Button>
            )}
          </div>
          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
