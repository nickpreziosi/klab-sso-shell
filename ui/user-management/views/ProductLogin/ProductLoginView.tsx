"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  Checkbox,
  FloatingLabelInput,
  Label,
  PageThemeSetter,
  cn,
} from "@k-lab/components";
import {
  getAuthBrandPanelLayerStyle,
  resolveAuthBrandPanel,
  type AuthBrandPanelConfig,
} from "@/ui/shared/utils/auth-brand-panel";

export interface ProductLoginConfig extends AuthBrandPanelConfig {
  name: string;
  description: string;
  welcomeText: string;
  Logo: React.ComponentType<{ className?: string; variant?: "dark" | "light" | "white" }>;
  loginPath: string;
  forgotPasswordPath: string;
  resetPasswordPath: string;
  signInWithEmailAndPassword?: (email: string, password: string) => Promise<void>;
}

interface ProductLoginViewProps {
  config: ProductLoginConfig;
}

/**
 * Split-panel login screen. Brand panel on the left, sign-in form on the right.
 */
export function ProductLoginView({ config }: ProductLoginViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    isLightBrand,
    brandBg,
    isGradient,
    useOverlay,
    darkLogoVariantDesktop,
    darkLogoVariantMobile,
  } = resolveAuthBrandPanel(config);

  const { Logo } = config;

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      setter(typeof e === "string" ? e : (e.target?.value ?? ""));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (config.signInWithEmailAndPassword) {
        await config.signInWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageThemeSetter theme="light" />
      <div className="h-screen w-full flex !bg-white overflow-hidden">
        <div
          className={cn(
            "relative hidden h-screen w-1/2 flex-col overflow-y-auto p-8 text-start lg:flex",
            isLightBrand ? "bg-white" : "bg-black"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={getAuthBrandPanelLayerStyle(
              brandBg,
              isLightBrand,
              isGradient,
              useOverlay,
              "desktop"
            )}
          />
          <div
            className={cn(
              "relative z-10 mx-auto flex min-h-full max-w-md flex-col justify-center",
              isLightBrand ? "text-black" : "text-white"
            )}
          >
            <div className="mb-4 flex w-full items-center justify-center gap-4">
              <Logo
                variant={isLightBrand ? "dark" : darkLogoVariantDesktop}
                className="h-24 w-auto"
                aria-hidden
              />
            </div>
            <h1 className="mt-0 mb-6 flex items-center justify-center gap-3 text-4xl font-bold leading-tight">
              <span className="sr-only">{config.name}</span>
            </h1>
            <p
              className={cn(
                "mb-12 text-lg leading-relaxed",
                isLightBrand ? "text-gray-700" : "text-white/90"
              )}
            >
              {config.description}
            </p>
          </div>
        </div>

        <div className="relative flex h-screen w-full flex-col items-center overflow-y-auto bg-white lg:w-1/2 lg:p-8 lg:pb-8">
          <div className="flex min-h-full w-full flex-col justify-start lg:justify-center">
            <div className={cn("relative h-64 lg:hidden", isLightBrand ? "bg-white" : "bg-black")}>
              <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={getAuthBrandPanelLayerStyle(
                  brandBg,
                  isLightBrand,
                  isGradient,
                  useOverlay,
                  "mobile"
                )}
              />
              <div className="relative z-10 flex h-64 flex-col items-center justify-center gap-4 px-4">
                <Logo
                  variant={isLightBrand ? "dark" : darkLogoVariantMobile}
                  className="h-16 w-auto"
                  aria-hidden
                />
                <h1
                  className={cn(
                    "flex items-center gap-2 text-2xl font-bold sm:text-3xl",
                    isLightBrand ? "text-black" : "text-white"
                  )}
                >
                  <span className="sr-only">{config.name}</span>
                </h1>
              </div>
            </div>

            <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center px-6 py-16 lg:px-0">
              <div className="mb-8">
                <h2 className="mb-2 text-4xl font-bold text-foreground">Sign in</h2>
                <p className="text-foreground">{config.welcomeText}</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <FloatingLabelInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={handleChange(setEmail)}
                  autoComplete="email"
                  required
                />

                <div className="space-y-2">
                  <FloatingLabelInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    autoComplete="current-password"
                    required
                  />
                  <div className="flex justify-end">
                    <Link
                      href={config.forgotPasswordPath}
                      className="text-sm font-medium text-accent-brand hover:text-accent-brand/90 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-x-2">
                  <Checkbox
                    variant="accent-brand"
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isSubmitting}
                  />
                  <Label className="text-sm font-normal text-muted-foreground" htmlFor="remember">
                    Remember me
                  </Label>
                </div>

                {authError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {authError}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  variant="accent-brand"
                  size="lg"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
