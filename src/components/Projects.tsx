// src/pages/Projects.tsx
import { Suspense, lazy } from 'react';

const ProjectsReal = lazy(() => import('../pages/ProjectsReal'));

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading…</div>}>
      <ProjectsReal />
    </Suspense>
  );
}