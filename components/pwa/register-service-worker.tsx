"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // instalación no disponible (ej. navegador sin soporte); no es crítico.
      });
    }
  }, []);

  return null;
}
