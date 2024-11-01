// app/layout.jsx
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { getServerAuthSession } from "@/lib/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';
import AccessibilityBar from '@/components/AccessibilityBar';

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
    <html lang="en" suppressHydrationWarning>
      <body
  className={cn(
    poppins.variable,
    inter.className,
    "antialiased scroll-smooth min-h-screen",
    "bg-background text-foreground",
    "dark:bg-background-dark dark:text-foreground",
    "transition-colors duration-300"
  )}
>
        <ThemeProvider>
          <AuthProvider session={session}>
            <ProfileProvider>
              <AccessibilityProvider>
                {children}
                <ToastContainer />
                <AccessibilityBar />
              </AccessibilityProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
