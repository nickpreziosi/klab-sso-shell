import { SHELL_AUTH_BRAND_BASE } from "@/config/auth/shell-auth-brand";
import { ProductAuthMessageView } from "@/ui/user-management/views/ProductAuthMessage/ProductAuthMessageView";

export default function ForgotPasswordPage() {
  return (
    <ProductAuthMessageView
      config={SHELL_AUTH_BRAND_BASE}
      title="Forgot password"
      message="Password recovery is not enabled in this environment yet. Contact your administrator to reset your credentials."
    />
  );
}
