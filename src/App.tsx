import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const dot = document.getElementById("cursor-dot");
    const trailContainer = document.createElement("div");
    trailContainer.id = "cursor-trail-container";
    document.body.appendChild(trailContainer);

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMoveTime = Date.now();

    const moveCursor = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      lastMoveTime = Date.now();

      // Add trail dot
      const trailDot = document.createElement("div");
      trailDot.className = "trail-dot";
      trailDot.style.left = `${targetX}px`;
      trailDot.style.top = `${targetY}px`;
      trailContainer.appendChild(trailDot);

      setTimeout(() => trailDot.remove(), 400);
    };

    const handleClick = () => {
      if (dot) {
        dot.classList.add("pulse");
        setTimeout(() => dot.classList.remove("pulse"), 300);
      }
    };

    // Magnetic effect logic
    const magneticElements = document.querySelectorAll(".magnetic");

    const magneticEffect = () => {
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = targetX - centerX;
        const distY = targetY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 100 && dot) {
          const strength = (100 - distance) / 100;
          const moveX = distX * strength * 0.3;
          const moveY = distY * strength * 0.3;
          dot.style.transform = `translate3d(${currentX + moveX}px, ${currentY + moveY}px, 0) scale(1.5)`;
        }
      });
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const idleTime = Date.now() - lastMoveTime;
      const offset = idleTime > 5 ? 10 : 0;

      if (dot) {
        dot.style.transform = `translate3d(${currentX + offset}px, ${currentY + offset}px, 0)`;
      }

      magneticEffect(); // <- Call here

      requestAnimationFrame(animate);
    };


    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", handleClick);
    animate();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", handleClick);
      trailContainer.remove();
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div
          id="cursor-dot"
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-[transform,background-color,width,height] duration-200 ease-in-out group-hover:scale-110"
          style={{
            width: "var(--dot-size, 12px)",
            height: "var(--dot-size, 12px)",
            backgroundColor: "var(--dot-color, #ffffff)",
            transition: "background-color 0.2s ease, width 0.2s ease, height 0.2s ease"
          }}
        />
        <div id="cursor-trail-container" className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9998]" />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;