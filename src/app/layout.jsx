import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { getServerAuthSession } from "@/lib/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  style: "normal",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  fallback: "arial, sans-serif",
  variable: "--font-poppins",
});

export const metadata = {
  title: "FlexFit",
  description: "A platform to enhance your fitness journey",
};

export default async function RootLayout({ children }) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          inter.className,
          poppins.className,
          "min-w-76 min-h-screen dark:bg-neutral-950 text-black dark:text-white"
        )}
      >
        <ThemeProvider>
          <AuthProvider session={session}>
            <ProfileProvider>{children}</ProfileProvider>
          </AuthProvider>
          <ToastContainer position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
