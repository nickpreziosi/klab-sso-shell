import { Suspense } from "react";
import { AuthHandoffView } from "@/ui/user-management/views/AuthHandoff/AuthHandoffView";

export default function AuthHandoffPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <AuthHandoffView />
    </Suspense>
  );
}
