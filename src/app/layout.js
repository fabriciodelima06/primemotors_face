import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import moment from 'moment'
import "./globals.css";
import 'moment/locale/pt-br'
import ErrorBoundary from "@/components/root/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prime Motors",
  description: "Facebook post auto",
};

export default function RootLayout({ children }) {

  moment.locale('pt-br')

  return (
    <html lang="pt">
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
