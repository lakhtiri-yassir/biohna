import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Biohna — Moroccan Artisan Marketplace",
  description: "Premium Moroccan natural products from artisan cooperatives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Providers>{children}</Providers>
      </body>
    <html lang="fr" dir="ltr">
  );
}
