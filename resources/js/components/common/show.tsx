import React from "react";

interface ShowProps<T> {
  when: T | null | false;
  children: React.ReactNode;
}

const Show = <T,>({ when, children }: ShowProps<T>) => {
  if (!when) {
    return null;
  }

  return children;
};

export default Show;
