import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const ThemeToggleIcon = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div className="relative w-6 h-6 transition-transform duration-500 group-hover:rotate-[180deg]">
      <div className="absolute inset-0 flex items-center justify-center text-yellow-400 group-hover:text-orange-500 transition-colors duration-500">
        {isDarkMode ? '☀️' : '🌙'}
      </div>
    </div>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Assume starting in dark mode

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
      isScrolled 
        ? 'bg-background/70 backdrop-blur-lg shadow-inner border-b-[3px] border-gradient-cyber' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <img 
                src="src/assets/MS_Logo_White_on_Transparent-removebg-preview.png" 
                alt="Logo" 
                className="h-24 w-auto bg-transparent hover:animate-pulse transition-opacity duration-300"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-cyan-400 hover:bg-transparent hover:drop-shadow-neon transition-all duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="#contact"
              className="group px-4 py-2 text-sm font-medium text-white border border-cyan-400 rounded-md transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-neon"
            >
              Hire Me
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const root = window.document.documentElement;
                root.classList.toggle('dark');
              }}
              className="group text-foreground transition-transform duration-300 hover:scale-110 hover:bg-transparent"
            >
              <ThemeToggleIcon isDarkMode={isDarkMode} />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-cyan-400"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-t border-border">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-cyan-400 hover:bg-transparent transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="px-3 py-2">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white border border-cyan-400 rounded-md transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-neon"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;