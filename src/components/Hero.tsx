import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Download, Mail } from "lucide-react";
import * as THREE from "three";

const Hero = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const topDotMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const [lineColor, setLineColor] = useState("#00ffff"); // will cycle through blend
  const [dotColor, setDotColor] = useState("#00ffff");
  const [lineMaterial, setLineMaterial] =
    useState<THREE.LineBasicMaterial | null>(null);
  const trackingTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Glow dot material (top)
    const topDotMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(dotColor),
      size: 0.4,
      transparent: true,
      opacity: 0.8,
    });
    topDotMaterialRef.current = topDotMaterial;

    const topDots = [];
    const topDotCount = 50;
    for (let i = 0; i < topDotCount; i++) {
      const dot = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        Math.random() * 50, // top half only
        (Math.random() - 0.5) * 100
      );
      topDots.push(dot);
    }

    const topDotGeometry = new THREE.BufferGeometry().setFromPoints(topDots);
    const topPointCloud = new THREE.Points(topDotGeometry, topDotMaterial);
    group.add(topPointCloud);

    // Bottom network structure
    const gridSize = 20;
    const spacing = 5;
    const bottomPoints = [];
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const x = i * spacing;
        const z = j * spacing;
        const y = Math.random() * 5 - 40; // Clamp to lower Y
        bottomPoints.push(new THREE.Vector3(x, y, z));
      }
    }

    // Rising stars: select 10% of bottomPoints randomly
    type RisingStar = {
      index: number;
      originY: number;
      velocity: number;
    };
    const risingStars: RisingStar[] = [];
    const risingCount = Math.floor(bottomPoints.length * 0.1);
    const chosenIndices = new Set<number>();
    while (risingStars.length < risingCount) {
      const i = Math.floor(Math.random() * bottomPoints.length);
      if (!chosenIndices.has(i)) {
        chosenIndices.add(i);
        risingStars.push({
          index: i,
          originY: bottomPoints[i].y,
          velocity: Math.random() * 0.02 + 0.01,
        });
      }
    }

    const pointMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(dotColor),
      size: 0.4,
    });
    pointMaterialRef.current = pointMaterial;
    const bottomGeometry = new THREE.BufferGeometry().setFromPoints(
      bottomPoints
    );
    const pointCloud = new THREE.Points(bottomGeometry, pointMaterial);
    group.add(pointCloud);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    setLineMaterial(lineMaterial);

    // Connect points in grid pattern
    const cols = gridSize * 2 + 1;
    for (let i = 0; i < bottomPoints.length; i++) {
      const right = i + 1;
      const below = i + cols;
      if (i % cols !== cols - 1 && right < bottomPoints.length) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          bottomPoints[i],
          bottomPoints[right],
        ]);
        group.add(new THREE.Line(geom, lineMaterial));
      }
      if (below < bottomPoints.length) {
        const geom = new THREE.BufferGeometry().setFromPoints([
          bottomPoints[i],
          bottomPoints[below],
        ]);
        group.add(new THREE.Line(geom, lineMaterial));
      }
    }

    // Mouse parallax
    let mouseX = 0,
      mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.001 + mouseX * 0.01;
      group.rotation.x = -0.3 + mouseY * 0.1;

      const positions = bottomGeometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < bottomPoints.length; i++) {
        const index = i * 3;
        const offset = i * 0.1;
        positions[index + 1] +=
          Math.sin(performance.now() * 0.001 + offset) * 0.03;
      }
      // Animate "rising stars"
      for (const star of risingStars) {
        const idx = star.index * 3;
        positions[idx + 1] += star.velocity;
        if (positions[idx + 1] > 30) {
          positions[idx + 1] = star.originY;
        }
      }
      bottomGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (lineMaterial) {
      lineMaterial.color.set(lineColor);
    }
  }, [lineColor, lineMaterial]);

  useEffect(() => {
    const colors = [
      "#00BFFF",
      "#1E90FF",
      "#4169E1",
      "#5F9EA0",
      "#4682B4",
      "#87CEEB",
      "#00CED1",
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setLineColor(colors[index]);
      if (pointMaterialRef.current) {
        pointMaterialRef.current.color.set(colors[index]);
      }
      if (topDotMaterialRef.current) {
        topDotMaterialRef.current.color.set(colors[index]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Proximity hover effect for dot images
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll("[data-hover-target]").forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const distance = Math.hypot(
          rect.left + rect.width / 2 - e.clientX,
          rect.top + rect.height / 2 - e.clientY
        );
        if (distance < 100) {
          el.setAttribute("data-hovering", "true");
        } else {
          el.removeAttribute("data-hovering");
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!trackingTextRef.current) return;

      const rect = trackingTextRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Increase sensitivity and responsiveness
      const rotateX = (-deltaY / 4).toFixed(2);
      const rotateY = (deltaX / 4).toFixed(2);

      trackingTextRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0">
        {/* Top Right - Personal Photo */}
        <div
          className="absolute top-[25%] right-[17%] proximity-hover"
          data-hover-target
        >
          <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse delay-1000 dot" />
          <div className="absolute -top-20 -right-20 flex items-center justify-center w-40 h-40 hover-image opacity-0 transition-opacity duration-300 pointer-events-none">
            <img
              src="/IMG_2199.JPG"
              alt="Profile"
              className="w-64 h-40 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Bottom Right - Location Image */}
        <div
          className="absolute top-[80%] right-[20%] proximity-hover"
          data-hover-target
        >
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse delay-500 dot" />
          <div className="absolute -top-20 -right-28 flex flex-col items-center justify-center w-72 h-48 hover-image opacity-0 transition-opacity duration-300 pointer-events-none">
            <img
              src="/Screenshot 2025-07-28 at 3.22.22 PM.png"
              alt="Profile"
              className="w-64 h-40 object-cover rounded-lg shadow-lg"
            />
            <span className="mt-2 text-xs text-white">
              Website & Web App Development
            </span>
          </div>
        </div>

        {/* Bottom Left - Website Screenshot */}
        <div
          className="absolute top-[70%] left-[28%] proximity-hover"
          data-hover-target
        >
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse delay-2000 dot" />
          <div className="absolute -top-20 -left-20 flex items-center justify-center w-40 h-40 hover-image opacity-0 transition-opacity duration-300 pointer-events-none">
            <div
              className="relative w-40 h-40 rounded-full bg-black bg-opacity-70 border border-cyber-green shadow-xl flex items-center justify-center text-white text-sm text-center text-wrap text-balance font-medium tracking-text"
              ref={trackingTextRef}
            >
              Based in London, Canada
              <span className="absolute w-full h-full border-4 border-cyber-green border-t-transparent rounded-full animate-spin-slow"></span>
            </div>
          </div>
        </div>

        {/* Top Left - App Screenshot */}
        <div
          className="absolute top-[25%] left-[17%] proximity-hover"
          data-hover-target
        >
          <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse dot" />
          <div className="absolute -top-20 -left-20 flex flex-col items-center justify-center w-40 h-80 hover-image opacity-0 transition-opacity duration-300 pointer-events-none">
            <img
              src="/app.png"
              alt="Profile"
              className="w-40 h-80 object-cover rounded-lg shadow-lg"
            />
            <span className="mt-2 text-xs text-white  px-2 py-1 rounded">
              Mobile App Development
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-white">
            IT Developer
          </h1>
          <h2 className="text-2xl md:text-3xl text-foreground mb-4">
            Full Stack Developer & Problem Solver
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            <p>
              I craft forward-thinking digital solutions powered by cutting-edge
              technologies. My expertise lies in modern web development,
              scalable system design, and robust cloud architecture.
            </p>
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
            onClick={() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
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

// Proximity hover CSS (add globally if not already)
// You can move this to your global stylesheet if preferred.
const style = document.createElement("style");
style.innerHTML = `
.proximity-hover {
  position: relative;
  perspective: 1000px;
}

.proximity-hover .hover-image {
  transform: rotateY(90deg);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform-origin: center;
}

.proximity-hover .dot {
  transition: opacity 0.3s ease;
}

.proximity-hover:hover .hover-image,
.proximity-hover[data-hovering="true"] .hover-image {
  transform: rotateY(0deg);
  opacity: 1 !important;
}

.proximity-hover:hover .dot,
.proximity-hover[data-hovering="true"] .dot {
  opacity: 0;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tracking-text {
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform-style: preserve-3d;
  transform-origin: center;
}
`;
if (
  typeof window !== "undefined" &&
  !document.getElementById("proximity-hover-css")
) {
  style.id = "proximity-hover-css";
  document.head.appendChild(style);
}
