import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroLivingRoom3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1E1410');
    scene.fog = new THREE.FogExp2('#1E1410', 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // ==========================================
    // LIGHTING: Soft Volumetric & Architectural
    // ==========================================
    const ambientLight = new THREE.AmbientLight('#E8D8C2', 0.8);
    scene.add(ambientLight);

    // Main warm sunlight beam from window (left side)
    const windowLight = new THREE.DirectionalLight('#F7F3ED', 2.8);
    windowLight.position.set(-6, 8, 4);
    windowLight.castShadow = true;
    windowLight.shadow.mapSize.width = 1024;
    windowLight.shadow.mapSize.height = 1024;
    windowLight.shadow.bias = -0.0005;
    scene.add(windowLight);

    // Warm ceiling cove accent light
    const warmFill = new THREE.PointLight('#C5A46D', 2.2, 18);
    warmFill.position.set(2, 4, 1);
    scene.add(warmFill);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight('#C5A46D', 0.6);
    rimLight.position.set(5, 3, -3);
    scene.add(rimLight);

    // ==========================================
    // MATERIALS: Luxury Walnut, Velvet, Gold, Marble
    // ==========================================
    const walnutMat = new THREE.MeshStandardMaterial({
      color: '#3A2418',
      roughness: 0.35,
      metalness: 0.05,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: '#D8CAB7',
      roughness: 0.85,
      metalness: 0.02,
    });

    const darkCushionMat = new THREE.MeshStandardMaterial({
      color: '#2A1B12',
      roughness: 0.75,
      metalness: 0.05,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: '#C5A46D',
      roughness: 0.25,
      metalness: 0.85,
    });

    const marbleMat = new THREE.MeshStandardMaterial({
      color: '#EFEAE1',
      roughness: 0.2,
      metalness: 0.1,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: '#281E19',
      roughness: 0.9,
    });

    const floorMat = new THREE.MeshStandardMaterial({
      color: '#221610',
      roughness: 0.45,
    });

    // Floor with wood plank effect
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Luxury area rug
    const rugGeo = new THREE.PlaneGeometry(7.2, 5);
    const rugMat = new THREE.MeshStandardMaterial({
      color: '#362B24',
      roughness: 0.95,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, -1.18, 0.5);
    rug.receiveShadow = true;
    scene.add(rug);

    // Back architectural feature wall with fluted wood slats
    const backWallGeo = new THREE.BoxGeometry(18, 10, 0.4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 3.5, -4);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Fluted wooden slats on back wall
    const slatGroup = new THREE.Group();
    for (let i = -6; i <= 6; i += 0.3) {
      const slatGeo = new THREE.BoxGeometry(0.12, 7, 0.08);
      const slat = new THREE.Mesh(slatGeo, walnutMat);
      slat.position.set(i, 2.3, -3.75);
      slat.castShadow = true;
      slatGroup.add(slat);
    }
    scene.add(slatGroup);

    // ==========================================
    // 3D FURNITURE ENSEMBLE
    // ==========================================

    // 1. SOFA
    const sofaGroup = new THREE.Group();
    // Base plinth (Walnut)
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 1.8), walnutMat);
    sofaBase.position.y = -0.95;
    sofaBase.castShadow = true;
    sofaGroup.add(sofaBase);

    // Seat cushions
    const seatGeo = new THREE.BoxGeometry(1.9, 0.45, 1.6);
    const seat1 = new THREE.Mesh(seatGeo, fabricMat);
    seat1.position.set(-1, -0.6, 0);
    seat1.castShadow = true;
    const seat2 = new THREE.Mesh(seatGeo, fabricMat);
    seat2.position.set(1, -0.6, 0);
    seat2.castShadow = true;
    sofaGroup.add(seat1, seat2);

    // Backrest
    const backGeo = new THREE.BoxGeometry(4.2, 1.1, 0.4);
    const back = new THREE.Mesh(backGeo, fabricMat);
    back.position.set(0, 0.1, -0.65);
    back.castShadow = true;
    sofaGroup.add(back);

    // Armrests
    const armGeo = new THREE.BoxGeometry(0.35, 0.85, 1.7);
    const leftArm = new THREE.Mesh(armGeo, fabricMat);
    leftArm.position.set(-2.1, -0.2, 0);
    leftArm.castShadow = true;
    const rightArm = new THREE.Mesh(armGeo, fabricMat);
    rightArm.position.set(2.1, -0.2, 0);
    rightArm.castShadow = true;
    sofaGroup.add(leftArm, rightArm);

    // Scatter Cushions
    const cushionGeo = new THREE.BoxGeometry(0.5, 0.5, 0.18);
    const c1 = new THREE.Mesh(cushionGeo, darkCushionMat);
    c1.position.set(-1.6, -0.1, -0.4);
    c1.rotation.y = 0.2;
    const c2 = new THREE.Mesh(cushionGeo, darkCushionMat);
    c2.position.set(1.6, -0.1, -0.4);
    c2.rotation.y = -0.25;
    sofaGroup.add(c1, c2);

    sofaGroup.position.set(0, 0, -0.6);
    scene.add(sofaGroup);

    // 2. COFFEE TABLE (Marble Top + Walnut & Gold Legs)
    const tableGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.08, 48), marbleMat);
    tableTop.position.set(0, -0.65, 1.4);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Gold pedestal base
    const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.4, 0.5, 32), goldMat);
    tableLeg.position.set(0, -0.92, 1.4);
    tableLeg.castShadow = true;
    tableGroup.add(tableLeg);

    scene.add(tableGroup);

    // 3. DESIGNER ACCENT CHAIR
    const chairGroup = new THREE.Group();
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.1), fabricMat);
    chairSeat.position.set(2.5, -0.7, 0.8);
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 24, 1, false, 0, Math.PI), fabricMat);
    chairBack.position.set(2.5, -0.25, 0.8);
    chairBack.rotation.y = -Math.PI / 1.3;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Chair Gold Legs
    for (let lx of [-0.45, 0.45]) {
      for (let lz of [-0.45, 0.45]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.48, 16), goldMat);
        leg.position.set(2.5 + lx, -0.96, 0.8 + lz);
        leg.castShadow = true;
        chairGroup.add(leg);
      }
    }
    chairGroup.rotation.y = -0.4;
    scene.add(chairGroup);

    // 4. FLOATING DUST PARTICLES
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 10;
      particlePos[i + 1] = Math.random() * 4 - 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: '#E8D8C2',
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // INTERACTION & ANIMATION LOOP
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation with mouse parallax and slow cinematic sway
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      const cinematicSway = Math.sin(elapsedTime * 0.4) * 0.15;
      camera.position.x = targetX * 1.5 + cinematicSway;
      camera.position.y = 2.2 - targetY * 0.8 + Math.cos(elapsedTime * 0.3) * 0.08;
      camera.lookAt(0, 0, 0.4);

      // Subtle table accessory rotation or glow
      tableGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.05;

      // Particle floating drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.002;
        if (positions[i] > 3.8) {
          positions[i] = -0.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
