import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { TanstackProvider } from "@/components/providers/tanstack-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CAS-MAABA Dental Clinic",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", poppins.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" />
          <ModalProvider />
          <TanstackProvider>{children}</TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
