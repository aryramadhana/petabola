"use client";

import { useEffect, useRef } from "react";
import { getLeagueColor, getLeagueTextColor } from "@/lib/clubs";
import type { Club } from "@/types";

interface Props {
  clubs: Club[];
  selectedId?: string | null;
  onSelectClub?: (club: Club, meta?: { fromMap?: boolean }) => void;
}

function pinHTML(c: Club): string {
  const color = getLeagueColor(c.league);
  const textColor = getLeagueTextColor(c.league);
  return `
    <div class="petabola-marker" style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
      <div style="position:relative;background:white;border-bottom:3px solid ${color};border-radius:8px;width:40px;height:40px;
        box-shadow:0 4px 20px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <span style="position:absolute;font-size:9px;font-weight:700;color:${textColor};font-family:sans-serif;">${c.abbr}</span>
        <img
          src="/logos/${c.id}.png"
          alt="${c.abbr}"
          style="position:relative;z-index:1;width:34px;height:34px;object-fit:contain;padding:3px;"
          onerror="this.style.display='none'"
        />
      </div>
      <div style="width:2px;height:6px;background:${color};"></div>
      <div style="width:5px;height:5px;border-radius:50%;background:${color};"></div>
    </div>`;
}

export function MapView({
  clubs,
  selectedId = null,
  onSelectClub = () => {},
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import("leaflet").map> | null>(null);
  const markersRef = useRef<Record<string, ReturnType<typeof import("leaflet").marker>>>({});
  const initializedRef = useRef(false);
  const fromMapClickRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: false,
        preferCanvas: false,
      }).setView([-2.5, 118], 5);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 18, subdomains: "abcd" }
      ).addTo(map);

      mapRef.current = map;
      addMarkers(L, map, clubs);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leaflet caches the container's pixel size at init and doesn't notice
  // CSS-driven resizes (e.g. Sidebar's width transition on collapse) —
  // without this, the map leaves blank/untiled space until the next pan/zoom.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame: number | null = null;
    const observer = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
      });
    });
    observer.observe(container);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !initializedRef.current) return;
    import("leaflet").then((L) => {
      if (mapRef.current) addMarkers(L, mapRef.current, clubs);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs]);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    if (fromMapClickRef.current) {
      // Marker was clicked directly on the map — the area is already in
      // view, so skip the auto zoom/pan.
      fromMapClickRef.current = false;
      return;
    }
    const club = clubs.find((c) => c.id === selectedId);
    const marker = markersRef.current[selectedId];
    if (club && marker) {
      mapRef.current.setView([club.lat, club.lng], 10, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function addMarkers(
    L: typeof import("leaflet"),
    map: ReturnType<typeof import("leaflet").map>,
    clubList: Club[]
  ) {
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    clubList.forEach((c) => {
      const icon = L.divIcon({
        className: "",
        html: pinHTML(c),
        iconSize: [40, 54],
        iconAnchor: [20, 54],
        popupAnchor: [0, -58],
      });

      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map);

      marker.on("click", () => {
        fromMapClickRef.current = true;
        onSelectClub(c, { fromMap: true });
      });
      markersRef.current[c.id] = marker;
    });
  }

  return <div ref={containerRef} className="w-full h-full" />;
}
