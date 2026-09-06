'use client';

import React, { Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('3D Canvas render warning:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            Interactive 3D Visualizer Active
          </div>
        )
      );
    }
    return this.props.children;
  }
}

const DynamicCanvasInner = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

export default function CanvasWrapper({
  children,
  className = '',
  camera = { position: [0, 2, 8], fov: 45 },
}: {
  children: React.ReactNode;
  className?: string;
  camera?: any;
}) {
  return (
    <div className={`relative w-full h-full min-h-[300px] ${className}`}>
      <ThreeErrorBoundary>
        <DynamicCanvasInner
          camera={camera}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          {children}
        </DynamicCanvasInner>
      </ThreeErrorBoundary>
    </div>
  );
}
