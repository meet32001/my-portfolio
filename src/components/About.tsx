import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Cloud, Zap } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Design",
      description: "Architecting robust database solutions for optimal performance and scalability."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Solutions",
      description: "Deploying and managing applications on modern cloud platforms."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance",
      description: "Optimizing applications for speed, efficiency, and outstanding user experience."
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-gradient-hero">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Passionate IT professional with expertise in full-stack development, 
            system architecture, and modern technology solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Story */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              My Journey in Technology
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              With years of experience in the IT industry, I've developed a deep passion for 
              creating innovative solutions that bridge the gap between complex technical 
              requirements and user-friendly experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My expertise spans across modern web technologies, cloud platforms, and database 
              systems. I believe in continuous learning and staying updated with the latest 
              industry trends to deliver cutting-edge solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing to 
              open-source projects, or mentoring fellow developers in the community.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="text-3xl font-bold text-primary mb-1">30+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="text-3xl font-bold text-secondary mb-1">3+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right side - Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/50"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-primary group-hover:text-secondary transition-colors duration-300 flex justify-center">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;