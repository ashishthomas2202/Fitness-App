import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { getServerAuthSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlexFit",
  description: "A platform to enhance your fitness journey",
};

export default function RootLayout({ children }) {
  const session = getServerAuthSession();
  return (
    <html lang="en">
      <body className={cn(inter.className, "dark:bg-gray-900")}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
