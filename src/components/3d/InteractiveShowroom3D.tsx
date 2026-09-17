import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Compass, Sparkles, ArrowRight } from 'lucide-react';
import type { Product } from '../../types.ts';

interface Hotspot {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number]; // 3D coordinates
  targetCamera: [number, number, number];
  lookAt: [number, number, number];
  productSlug: string;
}

interface InteractiveShowroom3DProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const InteractiveShowroom3D: React.FC<InteractiveShowroom3DProps> = ({
  products,
  onSelectProduct,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [screenCoords, setScreenCoords] = useState<{ [id: string]: { x: number; y: number; visible: boolean } }>({});
  
  const hotspots: Hotspot[] = [
    {
      id: 'sofa',
      name: 'SOFA',
      subtitle: 'Premium comfort for everyday living.',
      position: [0, 0.4, -0.6],
      targetCamera: [0, 1.8, 4.2],
      lookAt: [0, 0.2, -0.6],
      productSlug: 'the-heritage-sofa',
    },
    {
      id: 'coffee-table',
      name: 'COFFEE TABLE',
      subtitle: 'Natural textures with a modern silhouette.',
      position: [0, -0.35, 1.3],
      targetCamera: [-1.2, 1.4, 3.2],
      lookAt: [0, -0.4, 1.3],
      productSlug: 'the-artisan-coffee-table',
    },
    {
      id: 'accent-chair',
      name: 'ACCENT CHAIR',
      subtitle: 'A statement piece for quiet corners.',
      position: [2.6, 0.2, 0.9],
      targetCamera: [3.8, 1.6, 3.4],
      lookAt: [2.6, -0.2, 0.9],
      productSlug: 'the-modern-lounge-chair',
    },
    {
      id: 'tv-console',
      name: 'TV CONSOLE',
      subtitle: 'Functional storage with elegant proportions.',
      position: [-2.9, -0.1, -2.4],
      targetCamera: [-2.6, 1.6, 0.5],
      lookAt: [-2.9, -0.1, -2.4],
      productSlug: 'the-signature-tv-console',
    },
  ];

  // Store refs to control from React UI
  const controlsRef = useRef<{
    resetCamera: () => void;
    focusHotspot: (h: Hotspot) => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A130E');
    scene.fog = new THREE.FogExp2('#1A130E', 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    const defaultCamPos = new THREE.Vector3(0, 3.2, 8.5);
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ==========================================
    // LIGHTING & AMBIENCE
    // ==========================================
    const ambientLight = new THREE.AmbientLight('#E8D8C2', 0.7);
    scene.add(ambientLight);

    // Main warm sunlight beam
    const sunLight = new THREE.DirectionalLight('#FFF5E4', 2.4);
    sunLight.position.set(-6, 8, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Architectural warm ceiling light
    const coveLight = new THREE.PointLight('#C5A46D', 2.0, 15);
    coveLight.position.set(0, 4.2, 0);
    scene.add(coveLight);

    // Corner floor lamp light
    const lampLight = new THREE.PointLight('#F7F3ED', 1.6, 8);
    lampLight.position.set(3.4, 1.8, -2.4);
    scene.add(lampLight);

    // ==========================================
    // MATERIALS
    // ==========================================
    const walnutMat = new THREE.MeshStandardMaterial({
      color: '#3A2418',
      roughness: 0.35,
      metalness: 0.05,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: '#D4C5B3',
      roughness: 0.8,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: '#B5945B',
      roughness: 0.3,
      metalness: 0.75,
    });

    const marbleMat = new THREE.MeshStandardMaterial({
      color: '#ECE6DC',
      roughness: 0.2,
      metalness: 0.1,
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: '#261A13',
      roughness: 0.5,
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Large designer area rug
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 6),
      new THREE.MeshStandardMaterial({ color: '#3A2F27', roughness: 0.95 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, -1.18, 0.4);
    rug.receiveShadow = true;
    scene.add(rug);

    // Back architectural wall
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(24, 10, 0.4),
      new THREE.MeshStandardMaterial({ color: '#251C17', roughness: 0.9 })
    );
    wall.position.set(0, 3.8, -4);
    wall.receiveShadow = true;
    scene.add(wall);

    // Large window frame on left with scenic warm glow
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 7, 5),
      new THREE.MeshBasicMaterial({ color: '#E8D8C2', transparent: true, opacity: 0.15 })
    );
    windowGlass.position.set(-8.5, 2.5, 0);
    windowGlass.rotation.y = Math.PI / 2;
    scene.add(windowGlass);

    // Fluted timber slat feature wall section behind sofa
    for (let i = -3.5; i <= 3.5; i += 0.25) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.5, 0.1), walnutMat);
      slat.position.set(i, 2.1, -3.75);
      slat.castShadow = true;
      scene.add(slat);
    }

    // ==========================================
    // 3D FURNITURE PIECES IN SHOWROOM
    // ==========================================

    // 1. SOFA (Centerpiece)
    const sofaGroup = new THREE.Group();
    const sofaPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.28, 1.8), walnutMat);
    sofaPlinth.position.y = -0.95;
    sofaPlinth.castShadow = true;
    sofaGroup.add(sofaPlinth);

    const seatL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.6), fabricMat);
    seatL.position.set(-1.05, -0.6, 0);
    seatL.castShadow = true;
    const seatR = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 1.6), fabricMat);
    seatR.position.set(1.05, -0.6, 0);
    seatR.castShadow = true;
    sofaGroup.add(seatL, seatR);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 0.4), fabricMat);
    sofaBack.position.set(0, 0.1, -0.65);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 1.7), fabricMat);
    armL.position.set(-2.2, -0.2, 0);
    armL.castShadow = true;
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.85, 1.7), fabricMat);
    armR.position.set(2.2, -0.2, 0);
    armR.castShadow = true;
    sofaGroup.add(armL, armR);

    sofaGroup.position.set(0, 0, -0.6);
    scene.add(sofaGroup);

    // 2. COFFEE TABLE (Sculptural Marble + Walnut)
    const tableGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.09, 48), marbleMat);
    tableTop.position.set(0, -0.65, 1.3);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, 0.48, 32), accentMat);
    tableBase.position.set(0, -0.92, 1.3);
    tableBase.castShadow = true;
    tableGroup.add(tableBase);
    scene.add(tableGroup);

    // 3. ACCENT CHAIR
    const chairGroup = new THREE.Group();
    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 1.15), fabricMat);
    cSeat.position.set(2.6, -0.7, 0.9);
    cSeat.castShadow = true;
    chairGroup.add(cSeat);

    const cBack = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.85, 24, 1, false, 0, Math.PI), fabricMat);
    cBack.position.set(2.6, -0.25, 0.9);
    cBack.rotation.y = -Math.PI / 1.35;
    cBack.castShadow = true;
    chairGroup.add(cBack);

    for (let lx of [-0.45, 0.45]) {
      for (let lz of [-0.45, 0.45]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.48, 16), accentMat);
        leg.position.set(2.6 + lx, -0.96, 0.9 + lz);
        leg.castShadow = true;
        chairGroup.add(leg);
      }
    }
    chairGroup.rotation.y = -0.35;
    scene.add(chairGroup);

    // 4. SIGNATURE TV CONSOLE & ARTWORK ON WALL
    const consoleGroup = new THREE.Group();
    const consoleBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.9), walnutMat);
    consoleBody.position.set(-3.2, -0.6, -2.4);
    consoleBody.castShadow = true;
    consoleGroup.add(consoleBody);

    // Console fluted doors
    const doorGeo = new THREE.BoxGeometry(3.4, 0.6, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, accentMat);
    doorMesh.position.set(-3.2, -0.6, -1.92);
    consoleGroup.add(doorMesh);
    scene.add(consoleGroup);

    // Large minimalist luxury art frame above console
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.2, 0.06),
      new THREE.MeshStandardMaterial({ color: '#E8D8C2', roughness: 0.9 })
    );
    artFrame.position.set(-3.2, 2.0, -3.75);
    scene.add(artFrame);

    // Corner Floor Lamp with warm glowing bulb
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.5, 16), accentMat);
    lampPole.position.set(3.4, 0.5, -2.4);
    scene.add(lampPole);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.55, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#F7F3ED', roughness: 0.3 }));
    lampShade.position.set(3.4, 2.1, -2.4);
    scene.add(lampShade);

    // Ambient floating dust particles
    const particleGeo = new THREE.BufferGeometry();
    const pCount = 50;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 12;
      pPos[i + 1] = Math.random() * 4.5 - 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: '#E8D8C2',
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

    // ==========================================
    // INTERACTIVE CAMERA ORBIT & TRANSITIONS
    // ==========================================
    let targetCamPos = new THREE.Vector3().copy(defaultCamPos);
    let targetLookAt = new THREE.Vector3(0, 0.4, 0);
    let currentLookAt = new THREE.Vector3(0, 0.4, 0);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0; // azimuth
    let sphericalPhi = Math.PI / 3; // polar
    let sphericalRadius = 8.5;

    const updateCameraFromSpherical = () => {
      const x = sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      const y = sphericalRadius * Math.cos(sphericalPhi);
      const z = sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      targetCamPos.set(x, Math.max(y, 0.5), z);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.hotspot-overlay')) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsAutoRotating(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.005;
      sphericalPhi = Math.max(0.25, Math.min(Math.PI / 2.1, sphericalPhi - deltaY * 0.005));
      updateCameraFromSpherical();
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Attach control methods to ref
    controlsRef.current = {
      resetCamera: () => {
        setActiveHotspot(null);
        sphericalTheta = 0;
        sphericalPhi = Math.PI / 3.4;
        sphericalRadius = 8.5;
        updateCameraFromSpherical();
        targetLookAt.set(0, 0.4, 0);
        setIsAutoRotating(true);
      },
      focusHotspot: (h: Hotspot) => {
        setActiveHotspot(h);
        setIsAutoRotating(false);
        targetCamPos.set(...h.targetCamera);
        targetLookAt.set(...h.lookAt);
      },
    };

    // Calculate 2D screen positions for hotspots on each frame
    let animId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (isAutoRotating && !activeHotspot) {
        sphericalTheta += 0.0015;
        updateCameraFromSpherical();
      }

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      // Calculate screen coordinates for hotspots
      const newCoords: { [id: string]: { x: number; y: number; visible: boolean } } = {};
      const w = container.clientWidth;
      const h = container.clientHeight;

      hotspots.forEach((spot) => {
        tempVec.set(...spot.position);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1.0 && tempVec.x >= -1.1 && tempVec.x <= 1.1 && tempVec.y >= -1.1 && tempVec.y <= 1.1;
        const x = (tempVec.x * 0.5 + 0.5) * w;
        const y = (-(tempVec.y * 0.5) + 0.5) * h;

        newCoords[spot.id] = { x, y, visible: isVisible };
      });
      setScreenCoords(newCoords);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoRotating]);

  const handleHotspotClick = (h: Hotspot) => {
    if (activeHotspot?.id === h.id) {
      // If already active, open product details
      const matchedProd = products.find((p) => p.slug === h.productSlug);
      if (matchedProd) onSelectProduct(matchedProd);
    } else {
      controlsRef.current?.focusHotspot(h);
    }
  };

  const handleViewProduct = (slug: string) => {
    const matched = products.find((p) => p.slug === slug);
    if (matched) {
      onSelectProduct(matched);
    }
  };

  return (
    <div className="relative w-full h-[620px] md:h-[720px] bg-[#1A130E] rounded-2xl md:rounded-3xl overflow-hidden border border-[#C5A46D]/20 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Hotspots in Screen Space */}
      <div className="absolute inset-0 pointer-events-none hotspot-overlay overflow-hidden">
        {hotspots.map((spot) => {
          const coords = screenCoords[spot.id];
          if (!coords || !coords.visible) return null;
          const isSelected = activeHotspot?.id === spot.id;

          return (
            <div
              key={spot.id}
              style={{
                transform: `translate(${coords.x}px, ${coords.y}px)`,
                left: 0,
                top: 0,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform duration-200"
            >
              <button
                onClick={() => handleHotspotClick(spot)}
                className={`group relative flex items-center justify-center p-1 rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'scale-125 ring-4 ring-[#C5A46D] bg-[#3A2418]'
                    : 'bg-[#1E1410]/80 hover:bg-[#3A2418] hover:scale-110'
                }`}
                title={spot.name}
              >
                {/* Pulsing beacon wave */}
                <span className="absolute -inset-2 rounded-full bg-[#C5A46D]/30 animate-ping pointer-events-none" />
                <div className="w-8 h-8 rounded-full bg-[#C5A46D] text-[#1E1410] flex items-center justify-center shadow-lg font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#1E1410]" />
                </div>

                {/* Tooltip Tag */}
                <div
                  className={`absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1E1410]/95 backdrop-blur-md border border-[#C5A46D]/40 text-left px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transition-all duration-200 ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A46D]">
                    {spot.name}
                  </p>
                  <p className="text-xs text-[#E8D8C2] font-light max-w-[170px] truncate">
                    {spot.subtitle}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Top Left Status Badge */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2.5 bg-[#1E1410]/90 backdrop-blur-md border border-[#C5A46D]/30 px-4 py-2 rounded-full shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C5A46D] animate-pulse" />
        <span className="text-xs font-semibold tracking-wider text-[#E8D8C2] uppercase">
          Interactive 3D Showroom
        </span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={() => controlsRef.current?.resetCamera()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E1410]/85 hover:bg-[#3A2418] text-[#E8D8C2] hover:text-[#C5A46D] text-xs font-medium border border-[#C5A46D]/30 backdrop-blur-md transition-all shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Camera</span>
        </button>

        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all shadow-md backdrop-blur-md ${
            isAutoRotating
              ? 'bg-[#C5A46D] text-[#1E1410] border-[#C5A46D]'
              : 'bg-[#1E1410]/85 text-[#E8D8C2] border-[#C5A46D]/30 hover:bg-[#3A2418]'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          <span>{isAutoRotating ? 'Rotating' : 'Orbit'}</span>
        </button>
      </div>

      {/* Bottom Floating Card when Hotspot is Active */}
      {activeHotspot && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-20 bg-[#1E1410]/95 backdrop-blur-xl border border-[#C5A46D]/50 p-5 rounded-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A46D]/15 text-[#C5A46D] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                <span>Featured Piece</span>
              </div>
              <h4 className="text-lg font-serif-luxury font-bold text-[#F7F3ED]">
                {activeHotspot.name}
              </h4>
              <p className="text-sm text-[#E8D8C2] mt-1 font-light leading-relaxed">
                {activeHotspot.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C5A46D]/20 flex items-center justify-between gap-3">
            <span className="text-xs text-[#E8D8C2]/70 italic">
              Crafted with solid walnut &amp; premium finish
            </span>
            <button
              onClick={() => handleViewProduct(activeHotspot.productSlug)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C5A46D] hover:bg-[#b8955a] text-[#1E1410] text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>View Piece</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Left Gesture Guidance */}
      <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-2 text-xs text-[#E8D8C2]/60 pointer-events-none bg-[#1E1410]/60 px-3 py-1.5 rounded-lg border border-white/5">
        <Eye className="w-3.5 h-3.5 text-[#C5A46D]" />
        <span>Drag to orbit • Click glowing markers to inspect furniture</span>
      </div>
    </div>
  );
};
