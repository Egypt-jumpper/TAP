import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/app/providers";

export const metadata: Metadata = { title: "TaskMorph AI Power", description: "AI + Web3 platform powered by Sidra Chain and TAP." };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
