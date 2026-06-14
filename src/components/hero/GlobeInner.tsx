"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ReactGlobe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";

const CLOUDS_URL = "//unpkg.com/three-globe/example/img/earth-clouds.png";
const ALTITUDE = 1.75;

interface GlobeControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
  enablePan: boolean;
  minDistance: number;
  maxDistance: number;
}

// globe.gl attaches getGlobeRadius() at runtime but doesn't include it in GlobeMethods
type GlobeExt = GlobeMethods & { getGlobeRadius?: () => number };

const LOCATIONS = [
  {
    id: "surakarta",
    lat: -7.5755,
    lng: 110.8243,
    city: "Indonesia",
    desc: "Originally from Indonesia.",
    mapsUrl: "https://maps.google.com/?q=Surakarta,Indonesia",
  },
  {
    id: "laie",
    lat: 21.645,
    lng: -157.9255,
    city: "Hawaii",
    desc: "Currently Studying College in Hawaii.",
    mapsUrl: "https://maps.google.com/?q=Brigham+Young+University+Hawaii",
  },
];

function buildMarkerEl(
  city: string,
  desc: string,
  mapsUrl: string,
): HTMLElement {
  const container = document.createElement("div");
  container.style.cssText =
    "position:relative;display:flex;align-items:center;justify-content:center;" +
    "pointer-events:auto;cursor:pointer;user-select:none;width:30px;height:30px;";
  container.setAttribute("tabindex", "0");
  container.setAttribute(
    "aria-label",
    `${city}: ${desc} — Open in Google Maps`,
  );
  container.setAttribute("role", "link");

  const pin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  pin.setAttribute("viewBox", "0 0 24 24");
  pin.setAttribute("aria-hidden", "true");
  pin.style.cssText =
    "width:30px;height:30px;display:block;filter:drop-shadow(0 0 12px rgba(239,68,68,0.8));";

  const pinShape = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  pinShape.setAttribute(
    "d",
    "M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0",
  );
  pinShape.setAttribute("fill", "#ef4444");
  pinShape.setAttribute("stroke", "rgba(255,255,255,0.92)");
  pinShape.setAttribute("stroke-width", "1.8");
  pinShape.setAttribute("stroke-linecap", "round");
  pinShape.setAttribute("stroke-linejoin", "round");

  const pinCenter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  pinCenter.setAttribute("cx", "12");
  pinCenter.setAttribute("cy", "10");
  pinCenter.setAttribute("r", "2.8");
  pinCenter.setAttribute("fill", "#ffffff");

  pin.append(pinShape, pinCenter);

  const label = document.createElement("div");
  label.dataset.markerPill = "true";
  label.style.cssText =
    "position:absolute;left:34px;top:50%;transform:translateY(-50%);" +
    "min-width:190px;border:1px solid rgba(255,255,255,0.16);border-radius:10px;" +
    "background:rgba(10,15,30,0.72);box-shadow:0 16px 42px rgba(0,0,0,0.26);" +
    "backdrop-filter:blur(12px);padding:8px 10px;color:#f8fafc;line-height:1.25;";

  const title = document.createElement("strong");
  title.textContent = city;
  title.style.cssText =
    "display:block;font-size:13px;font-weight:700;color:#ffffff;";

  const detail = document.createElement("span");
  detail.textContent = desc;
  detail.style.cssText =
    "display:block;margin-top:2px;font-size:12px;font-weight:500;color:#94a3b8;";

  label.append(title, detail);
  container.append(pin, label);

  container.addEventListener("click", () => {
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  });
  container.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    }
  });

  return container;
}

function lockZoom(globe: GlobeExt) {
  const controls = globe.controls() as unknown as GlobeControls;
  controls.enableZoom = false;
  const globeRadius = globe.getGlobeRadius?.() ?? 100;
  const dist = globeRadius * (1 + ALTITUDE);
  controls.minDistance = dist;
  controls.maxDistance = dist;
}

interface Props {
  width: number;
  height: number;
  reducedMotion: boolean;
}

export default function GlobeInner({ width, height, reducedMotion }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const cloudsRafRef = useRef<number>(0);
  const reducedMotionRef = useRef(reducedMotion);

  const [htmlData] = useState(() =>
    LOCATIONS.map((loc) => ({
      ...loc,
      el: buildMarkerEl(loc.city, loc.desc, loc.mapsUrl),
    })),
  );

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    const globe = globeRef.current as GlobeExt | undefined;
    if (!globe) return;
    (globe.controls() as unknown as GlobeControls).autoRotate = !reducedMotion;
  }, [reducedMotion]);

  // Re-apply zoom lock whenever the canvas is resized — react-globe.gl touches
  // the renderer on resize which can reset control settings.
  useEffect(() => {
    const globe = globeRef.current as GlobeExt | undefined;
    if (!globe) return;
    lockZoom(globe);
  }, [width, height]);

  useEffect(() => () => cancelAnimationFrame(cloudsRafRef.current), []);

  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current as GlobeExt | undefined;
    if (!globe) return;
    const rm = reducedMotionRef.current;

    (globe.renderer() as THREE.WebGLRenderer).setClearColor(0x000000, 0);

    const controls = globe.controls() as unknown as GlobeControls;
    controls.autoRotate = !rm;
    controls.autoRotateSpeed = 0.25;
    controls.enablePan = false;

    globe.pointOfView({ lat: 8, lng: 150, altitude: ALTITUDE }, 0);

    // Apply immediately, then re-apply after one frame in case globe.gl's own
    // post-ready setup overwrites enableZoom / min/maxDistance.
    lockZoom(globe);
    requestAnimationFrame(() => lockZoom(globe));

    new THREE.TextureLoader().load(CLOUDS_URL, (texture: THREE.Texture) => {
      const radius = (globe.getGlobeRadius?.() ?? 100) * 1.007;
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 75, 75),
        new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          emissive: new THREE.Color(0x223344),
          emissiveIntensity: 0.15,
        }),
      );
      (globe.scene() as THREE.Scene).add(clouds);

      if (!rm) {
        const rotateClouds = () => {
          clouds.rotation.y += 0.00012;
          cloudsRafRef.current = requestAnimationFrame(rotateClouds);
        };
        cloudsRafRef.current = requestAnimationFrame(rotateClouds);
      }
    });
  }, []); // stable — reads reducedMotion via ref

  return (
    <ReactGlobe
      ref={globeRef}
      width={width}
      height={height}
      rendererConfig={{ alpha: true, antialias: true }}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      atmosphereColor="#3b82f6"
      atmosphereAltitude={0.15}
      htmlElementsData={htmlData}
      htmlElement={(d: unknown) => (d as { el: HTMLElement }).el}
      htmlAltitude={0.02}
      htmlTransitionDuration={300}
      onGlobeReady={handleGlobeReady}
    />
  );
}
