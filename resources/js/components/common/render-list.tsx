import React, { Children, ReactNode } from "react";

interface RenderListProps<T> {
  of: T[];
  render: (item: T, index: number) => ReactNode;
  renderFallback?: () => ReactNode;
}

const RenderList = <T,>({ of, render, renderFallback }: RenderListProps<T>): JSX.Element | null => {
  if (of?.length === 0) {
    if (renderFallback) {
      return <>{renderFallback()}</>;
    }

    return null;
  }

  return <>{Children.toArray(of.map((item, index) => render(item, index)))}</>;
};

export default RenderList;
