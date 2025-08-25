import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Hero from '../Hero';

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: ({ className }: any) => <div data-testid="github-icon" className={className} />,
  Linkedin: ({ className }: any) => <div data-testid="linkedin-icon" className={className} />,
  Download: ({ className }: any) => <div data-testid="download-icon" className={className} />,
  Mail: ({ className }: any) => <div data-testid="mail-icon" className={className} />,
}));

describe('Hero Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the main heading correctly', () => {
      render(<Hero />);
      expect(screen.getByText('IT Developer')).toBeInTheDocument();
    });

    it('renders the subtitle correctly', () => {
      render(<Hero />);
      expect(screen.getByText('Full Stack Developer & Problem Solver')).toBeInTheDocument();
    });

    it('renders the description paragraph', () => {
      render(<Hero />);
      expect(screen.getByText(/I craft forward-thinking digital solutions/)).toBeInTheDocument();
    });

    it('renders all social media links', () => {
      render(<Hero />);
      expect(screen.getByTestId('github-icon')).toBeInTheDocument();
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    });

    it('renders the resume download button', () => {
      render(<Hero />);
      expect(screen.getByText('View Resume')).toBeInTheDocument();
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });

    it('renders the contact button', () => {
      render(<Hero />);
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('has correct resume link', () => {
      render(<Hero />);
      const resumeLink = screen.getByText('View Resume').closest('a');
      expect(resumeLink).toHaveAttribute('href', 'https://drive.google.com/file/d/19Le4R9ZeH2qJmeY8zKmnO0fbgfJhwyY8/view?usp=sharing');
      expect(resumeLink).toHaveAttribute('target', '_blank');
      expect(resumeLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('has correct GitHub link', () => {
      render(<Hero />);
      const githubLink = screen.getByTestId('github-icon').closest('a');
      expect(githubLink).toHaveAttribute('href', 'https://github.com/meet32001');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('has correct LinkedIn link', () => {
      render(<Hero />);
      const linkedinLink = screen.getByTestId('linkedin-icon').closest('a');
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/meetshah30012002/');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct CSS classes to main section', () => {
      render(<Hero />);
      const mainSection = screen.getByText('IT Developer').closest('section');
      expect(mainSection).toHaveClass('relative', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'overflow-hidden');
    });

    it('applies gradient text to main heading', () => {
      render(<Hero />);
      const heading = screen.getByText('IT Developer');
      expect(heading).toHaveClass('bg-gradient-cyber', 'bg-clip-text', 'text-white');
    });

    it('applies animation classes to content sections', () => {
      render(<Hero />);
      const animatedElements = document.querySelectorAll('.animate-slide-up');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('renders with responsive text sizes', () => {
      render(<Hero />);
      const heading = screen.getByText('IT Developer');
      expect(heading).toHaveClass('text-5xl', 'md:text-7xl');
      
      const subtitle = screen.getByText('Full Stack Developer & Problem Solver');
      expect(subtitle).toHaveClass('text-2xl', 'md:text-3xl');
    });

    it('has responsive button layout', () => {
      render(<Hero />);
      const buttonContainer = screen.getByText('View Resume').closest('div');
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Hero />);
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveTextContent('IT Developer');
      expect(h2).toHaveTextContent('Full Stack Developer & Problem Solver');
    });

    it('has accessible button labels', () => {
      render(<Hero />);
      expect(screen.getByRole('button', { name: 'Get In Touch' })).toBeInTheDocument();
    });
  });

  describe('Three.js Integration', () => {
    it('creates canvas container for 3D graphics', () => {
      render(<Hero />);
      const canvasContainer = document.querySelector('[ref="canvasRef"]');
      expect(canvasContainer).toBeInTheDocument();
    });

    it('applies correct positioning classes to canvas', () => {
      render(<Hero />);
      const canvasContainer = document.querySelector('[ref="canvasRef"]');
      expect(canvasContainer).toHaveClass('absolute', 'inset-0', 'z-0');
    });
  });

  describe('Proximity Hover System', () => {
    it('renders proximity hover elements', () => {
      render(<Hero />);
      const proximityElements = document.querySelectorAll('[data-hover-target]');
      expect(proximityElements.length).toBeGreaterThan(0);
    });

    it('has correct proximity hover classes', () => {
      render(<Hero />);
      const proximityElements = document.querySelectorAll('.proximity-hover');
      expect(proximityElements.length).toBeGreaterThan(0);
    });
  });

  describe('Button Functionality', () => {
    it('contact button scrolls to contact section', () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;
      
      render(<Hero />);
      const contactButton = screen.getByRole('button', { name: 'Get In Touch' });
      
      fireEvent.click(contactButton);
      
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });
});
