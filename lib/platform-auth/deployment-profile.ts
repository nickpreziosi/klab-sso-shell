export type DeploymentProfile = "platform" | "isolated";

export function getDeploymentProfile(): DeploymentProfile {
  return process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE === "isolated" ? "isolated" : "platform";
}

export function isPlatformDeployment(): boolean {
  return getDeploymentProfile() === "platform";
}

export function getShellOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SHELL_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return "http://app.lvh.me:3000";
  }
  return "https://app.k-lab.ai";
}
