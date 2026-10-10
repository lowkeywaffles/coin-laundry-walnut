import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LangProvider } from "@/lib/i18n";
import strings from "@/content/strings.json";
import "./globals.css";

const f0 = Archivo_Black({ variable: "--font-archivo-black", subsets: ["latin"], weight: "400" });
const f1 = Archivo({ variable: "--font-archivo", subsets: ["latin"], style: ["normal", "italic"] });

const EN = strings.en as Record<string, string>;
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23d61f2c'/%3E%3Ccircle cx='32' cy='34' r='17' fill='%23fff'/%3E%3Ccircle cx='32' cy='34' r='12' fill='%231d3fb0'/%3E%3Cpath d='M22 36c4 4 16 4 20 0' stroke='%23fff' stroke-width='3' fill='none'/%3E%3Ccircle cx='18' cy='11' r='3' fill='%23fff'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: EN.title.replace(/&amp;/g, "&"),
  description: EN.desc,
  icons: { icon: ICON },
};
export const viewport: Viewport = { themeColor: "#d61f2c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${f0.variable} ${f1.variable}`}>
      <body className="min-h-dvh leading-relaxed">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LangProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
