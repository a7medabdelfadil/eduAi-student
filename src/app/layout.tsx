"use client";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "../_components/navBar";
import Notification from "~/_components/Notifications";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/new-password" ||
    pathname === "/forget-password" ||
    pathname === "/otp" ||
    pathname === "/confirm-account" ||
    pathname === "/choose-account";
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <title>EduAI Teacher</title>
        <meta name="description" content="Edu AI-Admin" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="bg-bgSecondary">
      <QueryClientProvider client={queryClient}>
          {!isLoginPage && <NavBar />}
          <Notification />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
