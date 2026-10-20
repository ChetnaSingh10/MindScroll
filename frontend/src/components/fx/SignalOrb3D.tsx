import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SignalOrbProps {
  score?: number; // 0-100 or null
  stressLevel?: 'Low' | 'Medium' | 'High' | 'Very High' | null;
  interactive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalOrb3D: React.FC<SignalOrbProps> = ({
  score = 65,
  stressLevel,
  interactive = true,
  className = '',
  size = 'md',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Compute accent color based on wellness score or stress level
  const getOrbColor = () => {
    if (stressLevel === 'Very High') return { primary: 0xef4444, secondary: 0xf97316 };
    if (stressLevel === 'High') return { primary: 0xf59e0b, secondary: 0xff6b1a };
    if (stressLevel === 'Medium') return { primary: 0xff8a3d, secondary: 0x38bdf8 };
    if (stressLevel === 'Low') return { primary: 0x10b981, secondary: 0x06b6d4 };

    if (score !== undefined && score !== null) {
      if (score >= 75) return { primary: 0x10b981, secondary: 0x38bdf8 }; // Thriving green/cyan
      if (score >= 55) return { primary: 0xff8a3d, secondary: 0xf59e0b }; // Orange signal
      if (score >= 40) return { primary: 0xf59e0b, secondary: 0xef4444 }; // Amber
      return { primary: 0xef4444, secondary: 0xa855f7 }; // Crimson/Purple
    }
    return { primary: 0xff6b1a, secondary: 0xff8a3d }; // Default brand orange
  };

  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    // Detect WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    if (motionQuery.matches) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    container.appendChild(renderer.domElement);

    const colors = getOrbColor();

    // 1. Particle Cloud Sphere
    const particleCount = size === 'sm' ? 450 : size === 'lg' ? 1200 : 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(colors.primary);
    const color2 = new THREE.Color(colors.secondary);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 + (Math.random() - 0.5) * 0.35;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mix = Math.random();
      const c = color1.clone().lerp(color2, mix);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 2. Inner Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 3. Orbiting Rings (signal rings)
    const ringGeo = new THREE.TorusGeometry(2.1, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colors.secondary,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh1.rotation.y = Math.PI / 6;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = Math.PI / 3;
    scene.add(ringMesh2);

    // Mouse tracking for subtle parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop with tab visibility pause
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (!document.hidden) {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Smooth cursor follow
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        particles.rotation.y += 0.25 * delta;
        particles.rotation.x = mouseY * 0.5;
        particles.rotation.y += mouseX * 0.5;

        coreMesh.rotation.y -= 0.15 * delta;
        coreMesh.rotation.z = Math.sin(time * 0.5) * 0.2;

        ringMesh1.rotation.z += 0.3 * delta;
        ringMesh2.rotation.z -= 0.25 * delta;

        // Subtle pulse
        const scalePulse = 1.0 + Math.sin(time * 1.8) * 0.035;
        particles.scale.set(scalePulse, scalePulse, scalePulse);

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [score, stressLevel, interactive, size]);

  // Fallback for no WebGL or reduced motion
  if (!webglSupported || prefersReducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-primary/40 via-accent/30 to-amber-500/20 blur-2xl animate-pulse" />
        <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-primary/30 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center">
            <span className="font-mono text-xs text-primary font-bold">[ SIGNAL ACTIVE ]</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[300px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-label="Interactive 3D Signal Orb representing habit resonance"
    />
  );
};
