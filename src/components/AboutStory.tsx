import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import type { BrandSettings } from '../types.ts';

interface AboutStoryProps {
  brand: BrandSettings;
  onExplore: () => void;
}

export const AboutStory: React.FC<AboutStoryProps> = ({ brand, onExplore }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Rotating 3D wooden furniture object
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 1.2, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Warm studio lights
    const ambientLight = new THREE.AmbientLight('#F7F3ED', 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#FFF', 2.0);
    dirLight.position.set(3, 4, 2);
    scene.add(dirLight);

    const goldRim = new THREE.PointLight('#C5A46D', 2.2, 8);
    goldRim.position.set(-2, 2, -2);
    scene.add(goldRim);

    // Sculptural Solid Walnut Lounge Chair Object
    const woodMat = new THREE.MeshStandardMaterial({
      color: '#3A2418',
      roughness: 0.32,
      metalness: 0.05,
    });
    const goldAccent = new THREE.MeshStandardMaterial({
      color: '#C5A46D',
      roughness: 0.25,
      metalness: 0.8,
    });
    const fabricMat = new THREE.MeshStandardMaterial({
      color: '#D4C5B3',
      roughness: 0.8,
    });

    const chairGroup = new THREE.Group();

    // Curved seat
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 1.1), fabricMat);
    seatMesh.position.y = -0.2;
    chairGroup.add(seatMesh);

    // Curved back
    const backMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.7, 24, 1, false, 0, Math.PI), fabricMat);
    backMesh.position.set(0, 0.2, 0);
    backMesh.rotation.y = -Math.PI / 1.1;
    chairGroup.add(backMesh);

    // Walnut arms
    for (let side of [-0.65, 0.65]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.9), woodMat);
      arm.position.set(side, 0.05, 0);
      chairGroup.add(arm);
    }

    // Gold tapered legs
    for (let lx of [-0.5, 0.5]) {
      for (let lz of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.02, 0.45, 16), goldAccent);
        leg.position.set(lx, -0.45, lz);
        chairGroup.add(leg);
      }
    }

    chairGroup.position.y = -0.1;
    scene.add(chairGroup);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      chairGroup.rotation.y += 0.008;
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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="about" className="py-24 bg-[#F7F3ED] text-[#24211F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[1.5px] bg-[#C5A46D]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A46D]">
                {brand.aboutStoryEyebrow || 'OUR STORY'}
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1E1410] leading-[1.15]">
              {brand.aboutStoryHeadline || 'Furniture Made for the Way You Live.'}
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#3A2418]/85 font-light leading-relaxed">
              {(Array.isArray(brand.aboutStoryParagraphs) ? brand.aboutStoryParagraphs : []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Showroom Owner Founder Note */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EFE9DF] border border-[#C5A46D]/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3A2418] text-[#C5A46D] flex items-center justify-center font-serif-luxury font-bold text-sm shrink-0 shadow-sm">
                TA
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-[#1E1410] italic font-serif-luxury leading-relaxed">
                  "Every piece in our showroom is selected and crafted with personal dedication to ensure comfort, authentic character, and generational durability for your family."
                </p>
                <p className="text-xs font-bold text-[#3A2418]">
                  {brand.showroom.ownerName || 'Tahir Abbas'}{' '}
                  <span className="text-[#C5A46D] font-normal">• {brand.showroom.ownerRole || 'Showroom Owner & Founder'}</span>
                </p>
              </div>
            </div>

            {/* Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#3A2418]/15">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#3A2418] font-bold text-sm uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                  <span>Durable Woods</span>
                </div>
                <p className="text-xs text-[#3A2418]/70 leading-normal">
                  Seasoned solid hardwoods inspected for lasting stability.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#3A2418] font-bold text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#C5A46D]" />
                  <span>Artisanal Finish</span>
                </div>
                <p className="text-xs text-[#3A2418]/70 leading-normal">
                  Master craftsmanship rooted in Pakistani furniture heritage.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#3A2418] font-bold text-sm uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-[#C5A46D]" />
                  <span>Tailored Comfort</span>
                </div>
                <p className="text-xs text-[#3A2418]/70 leading-normal">
                  Ergonomic proportions designed for everyday family living.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onExplore}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3A2418] hover:bg-[#1E1410] text-[#F7F3ED] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>DISCOVER OUR COLLECTION</span>
                <ArrowRight className="w-4 h-4 text-[#C5A46D] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Rotating Object & Cinematic Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D1B12] to-[#1E1410] p-6 shadow-2xl border border-[#C5A46D]/30">
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden flex items-center justify-center">
                {/* 3D WebGL Canvas */}
                <div ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab" />

                {/* Floating Craft Badge */}
                <div className="absolute top-4 left-4 bg-[#1E1410]/90 backdrop-blur-md border border-[#C5A46D]/40 px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A46D]">
                    3D Craftsmanship Preview
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#1E1410]/90 backdrop-blur-md border border-[#C5A46D]/30 px-3 py-1 rounded-lg text-[11px] text-[#E8D8C2]/70 pointer-events-none">
                  Solid Walnut &amp; Gold Hardware
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs tracking-widest uppercase text-[#C5A46D] font-medium">
                  "Crafting Comfort. Defining Your Space."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
