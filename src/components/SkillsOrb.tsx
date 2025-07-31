// SkillsOrb.tsx
import React, { useEffect } from "react";
import * as THREE from "three";
import "./SkillsOrb.css"; // CSS file for orb styling

const SkillsOrb = () => {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create glowing orb
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 1,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add light to enhance the glow
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 20;

    // Mouse move interaction
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      sphere.position.x = x * 10;
      sphere.position.y = y * 10;
      sphere.scale.set(1 + Math.abs(x) * 0.5, 1 + Math.abs(y) * 0.5, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      sphere.material.emissive.setHSL(0.6, 1.0, 0.5 + Math.sin(time * 0.5) * 0.2);
      sphere.scale.set(1.2 + Math.sin(time * 0.5) * 0.3, 1.2 + Math.sin(time * 0.5) * 0.3, 1);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div id="skills-orb">
      <h2>Skills Orb</h2> {/* Placeholders for your skills section */}
      {/* Skills Orb Animation goes here */}
    </div>
  );
};

export default SkillsOrb;