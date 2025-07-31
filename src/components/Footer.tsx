import { Heart, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              &lt;Dev/&gt;
            </span>
          </div>

          {/* Copyright */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>© 2024 Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>and</span>
            <Code className="h-4 w-4 text-primary" />
            <span>by Your Name</span>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            <a 
              href="#home" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              About
            </a>
            <a 
              href="#projects" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Border Decoration */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;