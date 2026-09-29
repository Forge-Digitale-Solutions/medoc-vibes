import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Médoc Vibes",
  description: "Tourisme festif & loisir dans le Médoc",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
