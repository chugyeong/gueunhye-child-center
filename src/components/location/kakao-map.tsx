"use client";

import { useEffect, useRef, useState } from "react";
import { centerStaticInfo } from "@/data/center";
import { useKakaoMaps, type KakaoMapInstance } from "@/lib/kakao/use-kakao-maps";
import { useCenterInfoStore } from "@/stores/centerInfoStore";

type KakaoMapProps = {
  className?: string;
};

export function KakaoMap({ className = "" }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const { maps, status } = useKakaoMaps(appKey);

  useEffect(() => {
    if (!maps || !mapRef.current || mapInstanceRef.current || !centerInfo) {
      return;
    }

    const position = new maps.LatLng(
      centerStaticInfo.coordinate.lat,
      centerStaticInfo.coordinate.lng,
    );
    const map = new maps.Map(mapRef.current, {
      center: position,
      level: 3,
    });
    const marker = new maps.Marker({
      position,
      title: centerInfo.center_name,
    });

    marker.setMap(map);
    mapInstanceRef.current = map;
    window.requestAnimationFrame(() => {
      map.relayout?.();
      map.setCenter?.(position);
      setIsMapRendered(true);
    });
  }, [centerInfo, maps]);

  const showOverlay = status !== "ready" || !isMapRendered;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm ${className}`}>
      <div
        ref={mapRef}
        className="h-full min-h-[280px] w-full"
        role="img"
        aria-label={`${centerInfo?.center_name ?? "센터"} 카카오 지도`}
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
