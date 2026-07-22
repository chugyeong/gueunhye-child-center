"use client";

import { useEffect, useState } from "react";

export type KakaoLatLng = object;
export type KakaoMapInstance = {
  relayout?: () => void;
  setCenter?: (position: KakaoLatLng) => void;
};
export type KakaoMarker = {
  setMap: (map: KakaoMapInstance) => void;
};
export type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  Marker: new (options: {
    position: KakaoLatLng;
    title?: string;
  }) => KakaoMarker;
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps;
    };
  }
}

const KAKAO_SCRIPT_ID = "kakao-map-sdk";

let kakaoMapsPromise: Promise<KakaoMaps> | null = null;

export type KakaoMapsStatus = "idle" | "loading" | "ready" | "missing-key" | "error";

export function useKakaoMaps(appKey?: string) {
  const [status, setStatus] = useState<KakaoMapsStatus>(
    appKey ? "idle" : "missing-key",
  );
  const [maps, setMaps] = useState<KakaoMaps | null>(null);

  useEffect(() => {
    if (!appKey) {
      return;
    }

    let isMounted = true;

    loadKakaoMaps(appKey)
      .then((loadedMaps) => {
        if (!isMounted) {
          return;
        }

        setMaps(loadedMaps);
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setMaps(null);
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [appKey]);

  return { maps, status };
}

function loadKakaoMaps(appKey: string) {
  if (window.kakao?.maps) {
    return new Promise<KakaoMaps>((resolve) => {
      window.kakao?.maps.load(() => {
        if (window.kakao?.maps) {
          resolve(window.kakao.maps);
        }
      });
    });
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  kakaoMapsPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_SCRIPT_ID);

    const handleLoad = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK loaded but window.kakao.maps is missing."));
        return;
      }

      window.kakao.maps.load(() => {
        if (window.kakao?.maps) {
          resolve(window.kakao.maps);
        } else {
          reject(new Error("Kakao Maps SDK failed during maps.load()."));
        }
      });
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}
