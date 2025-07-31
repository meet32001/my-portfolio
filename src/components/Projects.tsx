import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      features: [
        "Real-time inventory tracking",
        "Secure payment processing",
        "Admin analytics dashboard",
        "Mobile-responsive design"
      ],
      demoUrl: "#",
      githubUrl: "#",
      status: "Live",
      category: "Full Stack"
    },
    {
      title: "Task Management API",
      description: "RESTful API for project management with team collaboration features, built with microservices architecture.",
      technologies: ["Node.js", "Express", "MongoDB", "Docker", "JWT"],
      features: [
        "Microservices architecture",
        "JWT authentication",
        "Real-time notifications",
        "Dockerized deployment"
      ],
      demoUrl: "#",
      githubUrl: "#",
      status: "Development",
      category: "Backend"
    },
    {
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for business intelligence with real-time data visualization and reporting capabilities.",
      technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
      features: [
        "Interactive charts & graphs",
        "Real-time data updates",
        "Custom report generation",
        "Export functionality"
      ],
      demoUrl: "#",
      githubUrl: "#",
      status: "Live",
      category: "Frontend"
    },
    {
      title: "Cloud Infrastructure Automation",
      description: "Infrastructure as Code solution for automated deployment and scaling of cloud resources.",
      technologies: ["Terraform", "AWS", "Docker", "Kubernetes", "Python"],
      features: [
        "Automated provisioning",
        "Auto-scaling capabilities",
        "Cost optimization",
        "Multi-environment support"
      ],
      demoUrl: "#",
      githubUrl: "#",
      status: "Live",
      category: "DevOps"
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-hero">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing real-world solutions and technical expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30 hover:scale-105"
            >
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        project.status === 'Live' 
                          ? 'border-cyber-green text-cyber-green' 
                          : 'border-cyber-blue text-cyber-blue'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/30"
                  >
                    {project.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="outline"
                        className="text-xs border-border/50 hover:border-primary/50 transition-colors duration-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {project.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 group/btn hover:shadow-glow"
                  >
                    <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                    Live Demo
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn hover:bg-primary/10"
                  >
                    <Github className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                    Code
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn hover:bg-primary/10"
                  >
                    <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Want to see more of my work?
          </p>
          <Button variant="cyber" size="lg" className="group">
            <Github className="w-5 h-5 mr-2 group-hover:animate-spin" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;