import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trippy - Trip Places Suggestion",
  description: "Discover amazing places for your next trip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
