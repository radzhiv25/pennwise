import AuthGate from "@/components/AuthGate";

export default function AppLayout({ children }) {
  return <AuthGate>{children}</AuthGate>;
}
