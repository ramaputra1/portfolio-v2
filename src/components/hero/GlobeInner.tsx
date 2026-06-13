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
    desc: "Originally from Surakarta Indonesia.",
    mapsUrl: "https://maps.google.com/?q=Surakarta,Indonesia",
  },
  {
    id: "laie",
    lat: 21.645,
    lng: -157.9255,
    city: "Hawaii",
    desc: "Currently Stay in Hawaii for College Study.",
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
    "pointer-events:auto;cursor:pointer;user-select:none;width:14px;height:14px;";
  container.setAttribute("tabindex", "0");
  container.setAttribute("aria-label", `${city}: ${desc} — Open in Google Maps`);
  container.setAttribute("role", "link");

  const dot = document.createElement("span");
  dot.style.cssText =
    "width:10px;height:10px;border-radius:50%;background:#ef4444;" +
    "box-shadow:0 0 0 2px rgba(239,68,68,0.3),0 0 14px rgba(239,68,68,0.9);" +
    "display:block;flex-shrink:0;";

  container.appendChild(dot);

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
    controls.autoRotateSpeed = 0.5;
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
          clouds.rotation.y += 0.00025;
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
