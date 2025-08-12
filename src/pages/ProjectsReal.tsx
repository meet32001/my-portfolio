// src/pages/ProjectsReal.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Play } from "lucide-react";
import React from "react";

type Project = {
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  status: "Live" | "Completed" | "Live Prototype" | string;
  category: string;
  image: string; // filename in /src/assets
  demoAvailable?: boolean;
};

const projects: Project[] = [
  {
    title: "GetReadyToList – Service Platform",
    description:
      "Built a custom real-estate service platform around Housecall Pro, with a tailored booking flow, client onboarding, and high-end property presentation. I led UX, integrations, and automations to streamline operations end‑to‑end.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "n8n", "GA4", "Sentry (monitoring)"],
    demoUrl: "https://www.getreadytolist.com",
    githubUrl: null,
    status: "Live",
    category: "Client Work",
    image: "/image.png",
    demoAvailable: true,
  },
  {
    title: "Isolation",
    description:
      "Built a Canadian adaptation of the premium automotive concierge model from Europe’s Carsup, with secure storage, maintenance, and transport for luxury vehicles. I led UX, branding, and prototyping to help launch the service locally.",
    technologies: ["Figma", "UI/UX Design", "Prototyping", "Branding"],
    demoUrl:
      "https://www.figma.com/proto/GFlek4dggjEEjX2GX5dx8Y/Untitled?node-id=2-2&t=fW1CZIqkhxQWiIkz-1&starting-point-node-id=2%3A2",
    githubUrl: null,
    status: "Live Prototype",
    category: "UI/UX Design",
    image: "pexels-vladalex94-1461887.jpg",
    demoAvailable: true,
  },
  {
    title: "BulletWave: CS Team Builder",
    description:
      "An immersive, web-based Counter-Strike team management simulator. Users build squads, assign weapons, and compete against AI-generated teams with live API integration and real-time validation.",
    technologies: ["JavaScript", "HTML5", "CSS3", "REST API", "LocalStorage"],
    demoUrl: "https://counter-terrorist.vercel.app",
    githubUrl: "https://github.com/meet32001/CounterTerrorist.git",
    status: "Live",
    category: "Frontend",
    image: "istockphoto-924055190-612x612.jpg",
    demoAvailable: true,
  },
  {
    title: "DomHelp – Domestic Service Platform",
    description:
      "PHP-based web application for booking household help services like maids, cooks, and elder care. Includes user login, admin dashboard, and booking management.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "XAMPP"],
    demoUrl: null,
    githubUrl: "https://github.com/meet32001/domhelp",
    status: "Completed",
    category: "Full Stack",
    image: "phpproject.png",
    demoAvailable: false,
  },
];

export default function ProjectsReal() {
  return (
    <section id="projects" className="py-20 px-4 bg-gradient-hero">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-primary">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing real-world solutions and technical expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card
              key={project.title}
              className="group hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30 hover:scale-105"
            >
              <CardHeader className="space-y-4">
                <div className="w-full h-[300px] overflow-hidden rounded-md border border-border/30 mb-4">
                  <img
                    src={`/${project.image.replace(/^\//, '')}`}
                    alt={`${project.title} preview`}
                    className={[
                      "w-full h-full object-cover",
                      project.title === "BulletWave: CS Team Builder" ? "object-top scale-110" : "",
                    ].join(" ")}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                    <Badge
                      className={[
                        "text-xs border rounded px-2 py-0.5",
                        project.status === "Live"
                          ? "text-cyber-green border-cyber-green bg-transparent"
                          : "text-foreground",
                      ].join(" ")}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary border border-primary/30 rounded px-2 py-0.5"
                  >
                    {project.category}
                  </Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={`${project.title}-${tech}`}
                        className="text-xs border border-border/50 rounded px-2 py-0.5 hover:border-primary/50 transition-colors duration-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {project.demoAvailable && project.demoUrl ? (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full group/btn hover:shadow-glow">
                        <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                        Live Demo
                      </Button>
                    </a>
                  ) : (
                    <Button disabled variant="outline" size="sm" className="flex-1 opacity-60 cursor-not-allowed">
                      Demo Unavailable
                    </Button>
                  )}

                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full group/btn hover:bg-primary/10">
                        <Github className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                        Code
                      </Button>
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">Want to see more of my work?</p>
          <a href="https://github.com/meet32001" target="_blank" rel="noopener noreferrer">
            <Button variant="cyber" size="lg" className="group">
              <Github className="w-5 h-5 mr-2 group-hover:animate-spin" />
              View All Projects on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}