import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:"TaskMorph AI Power",description:"AI + Web3 platform powered by Sidra Chain and TAP."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
