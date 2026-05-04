"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import PanierModal from "@/components/modals/PanierModal";
import CategoriesModal from "@/components/modals/CategoriesModal";
import ContactModal from "@/components/modals/ContactModal";
import FavoritesModal from "@/components/modals/FavoritesModal";
import VendeurModal from "@/components/modals/VendeurModal";
import "@/i18n/index.js"; // Initialize i18n

/* Fixed background orbs — rendered once, never re-mount */
function BgOrbs() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          borderRadius: "50%",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
          width: "520px",
          height: "520px",
          top: "-160px",
          left: "-100px",
          background: "var(--orb-1)",
          animation: "orbFloat 18s ease-in-out infinite",
          transition: "background 0.6s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          borderRadius: "50%",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
          width: "420px",
          height: "420px",
          top: "40vh",
          right: "-80px",
          background: "var(--orb-2)",
          animation: "orbFloat 25s ease-in-out infinite",
          animationDelay: "-8s",
          transition: "background 0.6s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
          width: "600px",
          height: "600px",
          bottom: "-200px",
          left: "30%",
          background: "var(--orb-3)",
          animation: "orbFloat 22s ease-in-out infinite",
          animationDelay: "-4s",
          transition: "background 0.6s ease",
        }}
      />
    </>
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <BgOrbs />

          {/* Modals are portalled outside the page flow */}
          <PanierModal />
          <CategoriesModal />
          <ContactModal />
          <FavoritesModal />
          <VendeurModal />

          {children}
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
