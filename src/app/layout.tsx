import "@/styles/globals.css";

import { Montserrat } from "next/font/google";
import { type Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "next-themes";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillBridge App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider>
                {children} <Toaster />
              </ToastProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
