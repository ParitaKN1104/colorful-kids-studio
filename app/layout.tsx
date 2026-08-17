import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"Colorful Kids Studio", description:"เว็บระบายสีแสนสนุกสำหรับเด็ก เก็บผลงานเป็นคอลเลกชันได้", other:{"codex-preview":"development"}, icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="th"><body>{children}</body></html>;}
