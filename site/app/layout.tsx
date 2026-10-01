import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Médoc Vibes — manger, sortir, bouger",
  description:
    "L’app loisir du Médoc : restos, sorties, marchés, vides-greniers et surf. Complémentaire à l’app du Parc naturel régional.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${anton.variable} ${archivo.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
