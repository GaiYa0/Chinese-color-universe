"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen flex-col items-center justify-center bg-[#050510] p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">
              3D 场景加载失败
            </h1>
            <p className="mb-6 text-white/70">
              您的浏览器可能不支持 WebGL，或遇到临时错误
            </p>
            <a
              href="/galaxy"
              className="rounded-full bg-white/20 px-6 py-3 text-white transition hover:bg-white/30"
            >
              进入颜色星空
            </a>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
