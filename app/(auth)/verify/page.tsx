import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center" style={{ color: "#0f1b3d" }}>
          Check Your Email
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
          ✉️
        </div>
        <p className="text-slate-600">
          We&apos;ve sent a verification link to your email address. Please click the
          link to activate your account.
        </p>
        <p className="text-sm text-slate-400">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            try again
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
