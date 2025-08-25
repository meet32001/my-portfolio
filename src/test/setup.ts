import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Three.js
vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    background: null,
    add: vi.fn(),
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { z: 0 },
    aspect: 1,
    updateProjectionMatrix: vi.fn(),
  })),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    domElement: document.createElement('canvas'),
    render: vi.fn(),
    dispose: vi.fn(),
  })),
  Color: vi.fn(),
  PointsMaterial: vi.fn(() => ({
    color: { set: vi.fn() },
  })),
  LineBasicMaterial: vi.fn(),
  Group: vi.fn(() => ({
    add: vi.fn(),
    rotation: { x: 0, y: 0 },
  })),
  Vector3: vi.fn(),
  BufferGeometry: vi.fn(() => ({
    setFromPoints: vi.fn(),
    attributes: { position: { array: new Float32Array(), needsUpdate: false } },
  })),
  Points: vi.fn(),
  Line: vi.fn(),
}));

// Mock window methods
Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

// Mock performance.now
global.performance = {
  ...global.performance,
  now: vi.fn(() => 1000),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn();
