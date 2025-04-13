import { MouseEvent } from "react";

const handleBubbleEvent = <T extends HTMLElement>(e: MouseEvent<T>) => {
  e.stopPropagation();
  e.preventDefault();
};

export { handleBubbleEvent };
