"use client";

import AOS from "aos";
import { useEffect } from "react";

export function AosProvider() {
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return null;
}
