"use client";

import { useEffect, useRef, useState } from "react";
import { centerInfo } from "@/data/center";
import { useKakaoMaps, type KakaoMapInstance } from "@/lib/kakao/use-kakao-maps";

type KakaoMapProps = {
  className?: string;
};

export function KakaoMap({ className = "" }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const { maps, status } = useKakaoMaps(appKey);

  useEffect(() => {
    if (!maps || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    const position = new maps.LatLng(centerInfo.coordinate.lat, centerInfo.coordinate.lng);
    const map = new maps.Map(mapRef.current, {
      center: position,
      level: 3,
    });
    const marker = new maps.Marker({
      position,
      title: centerInfo.name,
    });

    marker.setMap(map);
    mapInstanceRef.current = map;
    window.requestAnimationFrame(() => {
      map.relayout?.();
      map.setCenter?.(position);
      setIsMapRendered(true);
    });
  }, [maps]);

  const showOverlay = status !== "ready" || !isMapRendered;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100 ${className}`}>
      <div
        ref={mapRef}
        className="h-full min-h-[320px] w-full"
        role="img"
        aria-label={`${centerInfo.name} 카카오 지도`}
      />
      {showOverlay ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 px-6 text-center">
          <p className="text-sm leading-6 text-stone-600">{getStatusMessage(status)}</p>
        </div>
      ) : null}
    </div>
  );
}

function getStatusMessage(status: string) {
  if (status === "missing-key") {
    return "카카오 지도 앱 키를 설정하면 이 영역에 지도가 표시됩니다.";
  }

  if (status === "error") {
    return "카카오 지도를 불러오지 못했습니다. JavaScript 키와 등록 도메인을 확인해 주세요.";
  }

  return "카카오 지도를 불러오는 중입니다.";
}
