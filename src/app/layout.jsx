import "@/app/globals.css";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "PennWise",
  description: "Your personal finance copilot",
  icons: {
    icon: "/favicon.svg",
  },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("pennwise-theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (_) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="theme antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
