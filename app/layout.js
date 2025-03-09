import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/themeProvider";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fashion Arewa",
  description: "Fashion Arewa App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Theme>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" expand={false} richColors />
            </AuthProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
