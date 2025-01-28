"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { MessagesContext } from "./Context/MessagesContext";
import ConvexClientProvider from "@/convex/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <ConvexClientProvider>
    <Provider>
          {children}
        </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
