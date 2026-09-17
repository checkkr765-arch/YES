import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Layers, Sparkles } from 'lucide-react';
import type { Product } from '../../types.ts';

interface FurnitureViewer3DProps {
  product: Product;
  autoRotate?: boolean;
}

export const FurnitureViewer3D: React.FC<FurnitureViewer3DProps> = ({
  product,
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<'Walnut' | 'Espresso' | 'Oak' | 'Ivory'>('Walnut');
  const [isRotating, setIsRotating] = useState(autoRotate);

  const finishColors = {
    Walnut: { wood: '#3A2418', fabric: '#D8CAB7', accent: '#C5A46D' },
    Espresso: { wood: '#1E1410', fabric: '#2E221D', accent: '#C5A46D' },
    Oak: { wood: '#A68256', fabric: '#EFE7DA', accent: '#B89B66' },
    Ivory: { wood: '#4A3326', fabric: '#F3EFE9', accent: '#D4AF37' },
  };

  const materialsRef = useRef<{
    woodMat: THREE.MeshStandardMaterial;
    fabricMat: THREE.MeshStandardMaterial;
    goldMat: THREE.MeshStandardMaterial;
  } | null>(null);

  useEffect(() => {
    if (!materialsRef.current) return;
    const colors = finishColors[activeFinish];
    materialsRef.current.woodMat.color.set(colors.wood);
    materialsRef.current.fabricMat.color.set(colors.fabric);
    materialsRef.current.goldMat.color.set(colors.accent);
  }, [activeFinish]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1E1410');

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(2.6, 2.0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight('#F7F3ED', 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFF', 2.2);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#C5A46D', 1.0);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight('#E8D8C2', 1.4, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Studio Circular Shadow Plane
    const shadowGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.04, 48);
    const shadowMat = new THREE.MeshStandardMaterial({
      color: '#140D0A',
      roughness: 0.9,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.y = -0.92;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Materials
    const initialColors = finishColors[activeFinish];
    const woodMat = new THREE.MeshStandardMaterial({
      color: initialColors.wood,
      roughness: 0.35,
      metalness: 0.05,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: initialColors.fabric,
      roughness: 0.8,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      roughness: 0.25,
      metalness: 0.85,
    });

    materialsRef.current = { woodMat, fabricMat, goldMat };

    // Procedural Furniture Mesh Construction based on product type
    const modelGroup = new THREE.Group();
    const modelType = product.threeDModel?.type || 'sofa';

    if (modelType === 'sofa') {
      // 1. Sofa
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 1.2), woodMat);
      base.position.y = -0.7;
      base.castShadow = true;
      modelGroup.add(base);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.05), fabricMat);
      seat.position.y = -0.45;
      seat.castShadow = true;
      modelGroup.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.3), fabricMat);
      back.position.set(0, 0.05, -0.42);
      back.castShadow = true;
      modelGroup.add(back);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.1), fabricMat);
      armL.position.set(-1.25, -0.15, 0);
      armL.castShadow = true;
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.1), fabricMat);
      armR.position.set(1.25, -0.15, 0);
      armR.castShadow = true;
      modelGroup.add(armL, armR);

      // Cushions
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.15), goldMat);
      c1.position.set(-0.85, -0.1, -0.2);
      c1.rotation.y = 0.2;
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.15), goldMat);
      c2.position.set(0.85, -0.1, -0.2);
      c2.rotation.y = -0.2;
      modelGroup.add(c1, c2);
    } else if (modelType === 'bed') {
      // 2. Bed
      const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 2.6), woodMat);
      bedFrame.position.y = -0.65;
      bedFrame.castShadow = true;
      modelGroup.add(bedFrame);

      const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 2.4), fabricMat);
      mattress.position.y = -0.35;
      mattress.castShadow = true;
      modelGroup.add(mattress);

      const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.3, 0.25), fabricMat);
      headboard.position.set(0, 0.35, -1.2);
      headboard.castShadow = true;
      modelGroup.add(headboard);

      // Pillows
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.45), goldMat);
      p1.position.set(-0.55, 0.02, -0.85);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.45), goldMat);
      p2.position.set(0.55, 0.02, -0.85);
      modelGroup.add(p1, p2);
    } else if (modelType === 'dining-table') {
      // 3. Dining Table
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 1.4), woodMat);
      top.position.y = 0.05;
      top.castShadow = true;
      modelGroup.add(top);

      for (let x of [-1.2, 1.2]) {
        for (let z of [-0.55, 0.55]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.9, 16), goldMat);
          leg.position.set(x, -0.42, z);
          leg.castShadow = true;
          modelGroup.add(leg);
        }
      }
    } else if (modelType === 'chair') {
      // 4. Accent Chair
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 1.2), fabricMat);
      seat.position.y = -0.4;
      seat.castShadow = true;
      modelGroup.add(seat);

      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.75, 24, 1, false, 0, Math.PI), fabricMat);
      back.position.set(0, 0.05, 0);
      back.rotation.y = -Math.PI / 1.1;
      back.castShadow = true;
      modelGroup.add(back);

      for (let x of [-0.48, 0.48]) {
        for (let z of [-0.48, 0.48]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.5, 16), goldMat);
          leg.position.set(x, -0.68, z);
          leg.castShadow = true;
          modelGroup.add(leg);
        }
      }
    } else if (modelType === 'console') {
      // 5. TV Console
      const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.65, 0.75), woodMat);
      consoleMesh.position.y = -0.3;
      consoleMesh.castShadow = true;
      modelGroup.add(consoleMesh);

      // Fluted front accent
      const frontAccent = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.55, 0.05), goldMat);
      frontAccent.position.set(0, -0.3, 0.39);
      modelGroup.add(frontAccent);

      for (let x of [-1.15, 1.15]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.65), goldMat);
        leg.position.set(x, -0.78, 0);
        modelGroup.add(leg);
      }
    } else {
      // 6. Coffee Table
      const cTop = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 48), woodMat);
      cTop.position.y = -0.3;
      cTop.castShadow = true;
      modelGroup.add(cTop);

      const cBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 0.55, 32), goldMat);
      cBase.position.set(0, -0.6, 0);
      cBase.castShadow = true;
      modelGroup.add(cBase);
    }

    scene.add(modelGroup);

    // Orbit & Drag interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      setIsRotating(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroup.rotation.x + deltaY * 0.006));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        modelGroup.rotation.y += 0.005;
      }

      camera.lookAt(0, -0.1, 0);
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, isRotating]);

  return (
    <div className="relative w-full h-[360px] md:h-[440px] bg-gradient-to-b from-[#241812] to-[#160E0A] rounded-2xl overflow-hidden border border-[#C5A46D]/25 shadow-xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Finish Selector */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1410]/90 backdrop-blur-md border border-[#C5A46D]/30 text-[#C5A46D] text-xs uppercase tracking-wider font-semibold pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Preview</span>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-full border backdrop-blur-md transition-all pointer-events-auto shadow-md ${
            isRotating
              ? 'bg-[#C5A46D] text-[#1E1410] border-[#C5A46D]'
              : 'bg-[#1E1410]/80 text-[#E8D8C2] border-[#C5A46D]/30 hover:bg-[#3A2418]'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Material Swatches */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1E1410]/90 backdrop-blur-md border border-[#C5A46D]/30 p-1.5 rounded-full shadow-lg">
        {(['Walnut', 'Espresso', 'Oak', 'Ivory'] as const).map((finish) => (
          <button
            key={finish}
            onClick={() => setActiveFinish(finish)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFinish === finish
                ? 'bg-[#C5A46D] text-[#1E1410] font-bold shadow'
                : 'text-[#E8D8C2] hover:text-white hover:bg-white/5'
            }`}
          >
            {finish}
          </button>
        ))}
      </div>
    </div>
  );
};
