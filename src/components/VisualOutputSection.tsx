import React, { useEffect, useRef, useState } from 'react';
import { ARTWORKS_DATA } from '../data/mockData';
import { Artwork } from '../types';
import { Plus, Eye } from 'lucide-react';
import * as THREE from 'three';

const NirvanaPhoenix: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 8.2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const emblem = new THREE.Group();
    scene.add(emblem);
    const texture = new THREE.TextureLoader().load('/nirvana-phoenix.png', (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      const image = loaded.image as HTMLImageElement;
      const aspect = image.width / image.height;
      const height = 4.15;
      const width = height * aspect;

      // Repeated, slightly darkened relief layers give the cutout a visible edge
      // when the emblem tilts, while keeping the supplied phoenix artwork intact.
      for (let layer = 0; layer < 20; layer += 1) {
        const relief = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          new THREE.MeshBasicMaterial({
            map: loaded,
            color: 0x9a5415,
            transparent: true,
            alphaTest: 0.04,
            depthWrite: true,
            side: THREE.DoubleSide
          })
        );
        relief.position.z = -0.58 + layer * 0.03;
        emblem.add(relief);
      }

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: loaded, transparent: true, alphaTest: 0.04, depthWrite: false, side: THREE.DoubleSide })
      );
      face.position.z = 0.04;
      emblem.add(face);
      emblem.position.y = 0.25;
      renderer.render(scene, camera);
    });

    let dragging = false;
    let moved = false;
    let suppressClick = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let frameId = 0;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      mount.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 1) moved = true;
      velocityY = deltaX * 0.008;
      velocityX = deltaY * 0.008;
      emblem.rotation.y += velocityY;
      emblem.rotation.x += velocityX;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (mount.hasPointerCapture(event.pointerId)) mount.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 100);
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    };
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (!dragging) {
        emblem.rotation.x += velocityX;
        emblem.rotation.y += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointercancel', onPointerUp);
      mount.removeEventListener('click', onClick);
      texture.dispose();
      emblem.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing" aria-label="Drag to rotate the three-dimensional phoenix emblem for NIRVANA 2026" />;
};

interface VisualOutputSectionProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onOpenJoinModal: () => void;
}

export const VisualOutputSection: React.FC<VisualOutputSectionProps> = ({
  onSelectArtwork,
  onOpenJoinModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Branding', 'Editorial', 'Posters', 'UI/UX', 'Logo Design', 'Event Identity'];

  const filteredArtworks = selectedCategory === 'All'
    ? ARTWORKS_DATA
    : ARTWORKS_DATA.filter((art) => art.category === selectedCategory);

  return (
    <section id="work" className="py-24 sm:py-32 bg-[#131313] relative z-20 border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
              05 // Archive Gallery
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-none tracking-tight text-white">
              Visual<br />
              Output
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
              Showing {filteredArtworks.length} of {ARTWORKS_DATA.length} Projects
            </span>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-xs px-3.5 py-1.5 uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-white text-[#131313] border-white font-semibold'
                      : 'bg-[#1A1A1A] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {filteredArtworks.map((art, idx) => {
            // Bento sizing rules
            let colSpan = 'md:col-span-4';
            let aspect = 'aspect-square';

            if (idx === 0) {
              colSpan = 'md:col-span-8';
              aspect = 'aspect-[16/9]';
            } else if (idx === 1) {
              colSpan = 'md:col-span-4';
              aspect = 'h-full min-h-[380px]';
            }

            return (
              <div
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className={`${colSpan} group cursor-pointer relative overflow-hidden border border-white/10 bg-[#1A1A1A] transition-all hover:border-white/40`}
              >
                <div className={`${aspect} relative overflow-hidden w-full`}>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 z-10" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50 z-10" />

                  {art.id === 'art-nirvana-2026' ? (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,94,20,0.18),transparent_58%)]" />
                      <NirvanaPhoenix />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none font-mono text-[9px] uppercase tracking-[0.28em] text-amber-100/55">Drag to rotate</div>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 md:group-hover:scale-105 opacity-100 md:opacity-60 md:mix-blend-luminosity md:group-hover:opacity-100 md:group-hover:mix-blend-normal"
                      style={{ backgroundImage: `url('${art.imageUrl}')` }}
                    />
                  )}

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-mono text-[10px] bg-white/10 backdrop-blur-sm px-2.5 py-1 uppercase tracking-widest border border-white/20 text-white/80">
                      {art.category}
                    </span>
                  </div>

                  {/* Eye Hover Action Indicator */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-2 bg-black/60 backdrop-blur-md rounded-none border border-white/20 text-white block">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="font-mono text-[10px] text-neutral-400 block mb-1">
                          BY {art.artistName.toUpperCase()} — {art.year}
                        </span>
                        <h4 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight group-hover:text-neutral-200 transition-colors">
                          {art.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Special Square: Submit / Join Archive Tile */}
          <div
            onClick={onOpenJoinModal}
            className="md:col-span-4 group cursor-pointer relative overflow-hidden aspect-square border border-white/10 bg-[#1A1A1A] flex flex-col items-center justify-center p-8 hover:bg-[#252525] transition-all duration-300"
          >
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 z-10" />
            <div className="p-4 bg-white/5 border border-white/10 mb-4 group-hover:bg-white group-hover:text-[#131313] transition-colors">
              <Plus className="w-6 h-6 text-white/70 group-hover:text-[#131313] transition-colors" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-center text-white/80 group-hover:text-white transition-colors mb-2">
              Submit Artwork / Join Archives
            </h4>
            <p className="text-[11px] text-neutral-400 text-center max-w-xs">
              Are you an MGIT student exploring branding, posters, digital art, or interfaces? Apply to showcase your work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
