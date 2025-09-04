  export const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const scrollable = target.scrollHeight > target.clientHeight;

    if (!scrollable) {
      e.preventDefault();
    }
  };