import { Suspense } from "react";

import { LoginView } from "@/ui/user-management/views/Login/LoginView";

export default function LoginPage() {
  // Suspense required: LoginView reads `?next=` via useSearchParams.
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
