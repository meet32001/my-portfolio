import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "HTML5 / CSS / Tailwind", level: 95 },
        { name: "React.js / Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Android (Java/Kotlin)", level: 85 },
        { name: "Flutter (Dart)", level: 80 },
        { name: "Swift UI", level: 75 }
      ],
      color: "cyber-blue"
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js / Express.js", level: 90 },
        { name: "Python / Java", level: 85 },
        { name: "RESTful APIs", level: 95 },
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 85 },
        { name: "Firebase", level: 80 }
      ],
      color: "cyber-purple"
    },
    {
      title: "DevOps & Cloud",
      skills: [
        { name: "Ubuntu Linux", level: 90 },
        { name: "CI/CD Pipelines", level: 90 },
        { name: "Docker", level: 85 },
        { name: "AWS", level: 80 },
        { name: "Google Cloud", level: 80 }
      ],
      color: "cyber-green"
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git / GitHub", level: 95 },
        { name: "Postman", level: 85 },
        { name: "Figma", level: 80 },
        { name: "Agile", level: 90 },
        { name: "Machine Learning", level: 75 },
        { name: "IoT Projects", level: 80 }
      ],
      color: "neon-pink"
    }
  ];

  const certifications = [
    "Finalist of Hackathon 2022",
    "Robofest Round 1 winner",
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Technical Skills
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive toolkit of modern technologies and proven expertise
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <Card 
              key={index}
              className="group hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30"
            >
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <div className={`w-3 h-3 bg-${category.color} rounded-full animate-pulse`} />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">{skill.name}</span>
                      <span className="text-muted-foreground text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-${category.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl text-foreground text-center">
              Certifications & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {certifications.map((cert, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-primary border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 px-4 py-2"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;