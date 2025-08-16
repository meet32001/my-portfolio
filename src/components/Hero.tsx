// Hero.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Download, Mail } from "lucide-react";
import * as THREE from "three";

const Hero = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const topDotMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const [lineColor, setLineColor] = useState("#00ffff");
  const [lineMaterial, setLineMaterial] = useState<THREE.LineBasicMaterial | null>(null);
  const trackingTextRef = useRef<HTMLDivElement | null>(null);

  /* ---------- THREE.js scene ---------- */
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Top floating dots
    const topDotMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#00ffff"),
      size: 0.4,
      transparent: true,
      opacity: 0.8,
    });
    topDotMaterialRef.current = topDotMaterial;

    const topDots: THREE.Vector3[] = [];
    for (let i = 0; i < 50; i++) {
      topDots.push(
        new THREE.Vector3((Math.random() - 0.5) * 100, Math.random() * 50, (Math.random() - 0.5) * 100)
      );
    }
    const topDotGeometry = new THREE.BufferGeometry().setFromPoints(topDots);
    group.add(new THREE.Points(topDotGeometry, topDotMaterial));

    // Bottom grid points
    const gridSize = 20;
    const spacing = 5;
    const bottomPoints: THREE.Vector3[] = [];
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        bottomPoints.push(new THREE.Vector3(i * spacing, Math.random() * 5 - 40, j * spacing));
      }
    }

    // Rising stars (subset of bottom points)
    type RisingStar = { index: number; originY: number; velocity: number };
    const risingStars: RisingStar[] = [];
    const risingCount = Math.floor(bottomPoints.length * 0.1);
    const chosen = new Set<number>();
    while (risingStars.length < risingCount) {
      const idx = Math.floor(Math.random() * bottomPoints.length);
      if (!chosen.has(idx)) {
        chosen.add(idx);
        risingStars.push({ index: idx, originY: bottomPoints[idx].y, velocity: Math.random() * 0.02 + 0.01 });
      }
    }

    const pointMaterial = new THREE.PointsMaterial({ color: new THREE.Color("#00ffff"), size: 0.4 });
    pointMaterialRef.current = pointMaterial;

    const bottomGeometry = new THREE.BufferGeometry().setFromPoints(bottomPoints);
    const pointCloud = new THREE.Points(bottomGeometry, pointMaterial);
    group.add(pointCloud);

    const lm = new THREE.LineBasicMaterial({ color: 0x00ffff });
    setLineMaterial(lm);

    // Connect grid neighbors
    const cols = gridSize * 2 + 1;
    for (let i = 0; i < bottomPoints.length; i++) {
      const right = i + 1;
      const below = i + cols;
      if (i % cols !== cols - 1 && right < bottomPoints.length) {
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([bottomPoints[i], bottomPoints[right]]), lm));
      }
      if (below < bottomPoints.length) {
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([bottomPoints[i], bottomPoints[below]]), lm));
      }
    }

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.001 + mouseX * 0.01;
      group.rotation.x = -0.3 + mouseY * 0.1;

      const pos = bottomGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < bottomPoints.length; i++) {
        const idx = i * 3;
        const offset = i * 0.1;
        pos[idx + 1] += Math.sin(performance.now() * 0.001 + offset) * 0.03;
      }
      for (const s of risingStars) {
        const idx = s.index * 3;
        pos[idx + 1] += s.velocity;
        if (pos[idx + 1] > 30) pos[idx + 1] = s.originY;
      }
      bottomGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update line color
  useEffect(() => {
    if (lineMaterial) lineMaterial.color.set(lineColor);
  }, [lineColor, lineMaterial]);

  // Cycle palette + sync point colors
  useEffect(() => {
    const colors = ["#00BFFF", "#1E90FF", "#4169E1", "#5F9EA0", "#4682B4", "#87CEEB", "#00CED1"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % colors.length;
      setLineColor(colors[i]);
      pointMaterialRef.current?.color.set(colors[i]);
      topDotMaterialRef.current?.color.set(colors[i]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* ---------- Proximity hover (single-nearest target) ---------- */
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-hover-target]"));
    const ACTIVE_R = 120;

    const onMove = (e: MouseEvent) => {
      let nearest: HTMLElement | null = null;
      let best = Infinity;

      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(cx - e.clientX, cy - e.clientY);
        if (d < best) { best = d; nearest = el; }
      }

      // only the closest target toggles within radius
      for (const el of targets) el.removeAttribute("data-hovering");
      if (nearest && best <= ACTIVE_R) nearest.setAttribute("data-hovering", "true");
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ---------- Title tilt tracking ---------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = trackingTextRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `rotateX(${(-dy / 4).toFixed(2)}deg) rotateY(${(dx / 4).toFixed(2)}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Floating proximity targets */}
      <div className="absolute inset-0">
        {/* Top Right */}
        <div className="absolute top-[25%] right-[17%] proximity-hover z-10" data-hover-target>
          <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse delay-1000 dot" />
          <div className="absolute -top-20 -right-20 flex items-center justify-center w-40 h-40 hover-image opacity-0 pointer-events-none">
            <img src="hero-bg.jpg" alt="Profile" className="w-64 h-40 object-cover rounded-lg shadow-lg" />
          </div>
        </div>

        {/* Bottom Right */}
        <div className="absolute top-[80%] right-[20%] proximity-hover z-10" data-hover-target>
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse delay-500 dot" />
          <div className="absolute -top-20 -right-28 flex flex-col items-center justify-center w-72 h-48 hover-image opacity-0 pointer-events-none">
            <img
              src="Screenshot 2025-07-28 at 3.22.22 PM.png"
              alt="Web work"
              className="w-64 h-40 object-cover rounded-lg shadow-lg"
            />
            <span className="mt-2 text-xs text-white">Website &amp; Web App Development</span>
          </div>
        </div>

        {/* Bottom Left */}
        <div className="absolute top-[70%] left-[28%] proximity-hover z-10" data-hover-target>
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse delay-2000 dot" />
          <div className="absolute -top-20 -left-20 flex items-center justify-center w-40 h-40 hover-image opacity-0 pointer-events-none">
            <div
              className="relative w-40 h-40 rounded-full bg-black/70 border border-cyber-green shadow-xl flex items-center justify-center text-white text-sm text-center font-medium tracking-text"
              ref={trackingTextRef}
            >
              Based in London, Canada
              <span className="absolute w-full h-full border-4 border-cyber-green border-t-transparent rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Top Left */}
        <div className="absolute top-[25%] left-[17%] proximity-hover z-10" data-hover-target>
          <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse dot" />
          <div className="absolute -top-20 -left-20 flex flex-col items-center justify-center w-40 h-80 hover-image opacity-0 pointer-events-none">
            <img src="app.png" alt="App" className="w-40 h-80 object-cover rounded-lg shadow-lg" />
            <span className="mt-2 text-xs text-white px-2 py-1 rounded">Mobile App Development</span>
          </div>
        </div>
      </div>

      {/* Text + CTAs */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-white">IT Developer</h1>
          <h2 className="text-2xl md:text-3xl text-foreground mb-4">Full Stack Developer &amp; Problem Solver</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            I craft forward-thinking digital solutions powered by modern web tech, scalable systems, and robust cloud
            architecture.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
          <a
            href="https://drive.google.com/file/d/19Le4R9ZeH2qJmeY8zKmnO0fbgfJhwyY8/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-medium bg-cyber hover:shadow-[0_0_20px_#00BFFF] transition-shadow duration-300 group"
          >
            <Download className="mr-2 h-5 w-5" />
            View Resume
          </a>
          <Button
            variant="neon"
            size="lg"
            className="group"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Mail className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Get In Touch
          </Button>
        </div>

        <div className="flex justify-center space-x-6 animate-slide-up">
          <a
            href="https://github.com/meet32001"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-[#00BFFF]/30 hover:border-[#00BFFF] hover:bg-[#00BFFF]/10 transition-all duration-300 hover:shadow-[0_0_15px_#00BFFF] group"
          >
            <Github className="h-6 w-6 text-[#00BFFF] group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a
            href="https://www.linkedin.com/in/meetshah30012002/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-[#00BFFF]/30 hover:border-[#00BFFF] hover:bg-[#00BFFF]/10 transition-all duration-300 hover:shadow-[0_0_15px_#00BFFF] group"
          >
            <Linkedin className="h-6 w-6 text-[#00BFFF] group-hover:scale-110 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

/* ---------- Proximity CSS (injected once) ---------- */
(() => {
  if (typeof window === "undefined") return;
  if (document.getElementById("proximity-hover-css")) return;

  const style = document.createElement("style");
  style.id = "proximity-hover-css";
  style.innerHTML = `
  .proximity-hover { position: relative; perspective: 1000px; }
  .proximity-hover .hover-image { transform: rotateY(90deg); opacity: 0; pointer-events: none; transition: transform .5s ease, opacity .5s ease; transform-origin: center; }
  .proximity-hover .dot { transition: opacity .3s ease; }
  /* ONLY proximity flag triggers visibility */
  .proximity-hover[data-hovering="true"] .hover-image { transform: rotateY(0deg); opacity: 1 !important; }
  .proximity-hover[data-hovering="true"] .dot { opacity: 0; }
  .animate-spin-slow { animation: spin 3s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
  .tracking-text { transition: transform .1s ease-out; will-change: transform; transform-style: preserve-3d; transform-origin: center; }
  `;
  document.head.appendChild(style);
})();