import { Suspense, type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sm:min-h-[100dvh] sm:flex sm:items-center sm:justify-center bg-slate-50 px-4 pt-10 sm:pt-0 pb-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#0f1b3d" }}>
            Waterfront Direct Mail
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reach waterfront homeowners with precision
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-slate-400">Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
