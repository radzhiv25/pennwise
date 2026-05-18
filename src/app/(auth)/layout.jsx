import { AuthShell } from "@/components/auth-shell";

export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
