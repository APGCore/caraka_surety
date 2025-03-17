import React from "react";

interface ShowProps<T> {
  when: T | null | boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Show = <T,>({ when, children, fallback }: ShowProps<T>) => {
  if (!when) {
    return fallback || null;
  }

  return children;
};

export default Show;
