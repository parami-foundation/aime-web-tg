import { useState, useEffect } from "react";

export default () => {
  const [viewport, setViewport] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => {
      if (!window.visualViewport) return
      setViewport({
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      });
    };

    window.visualViewport?.addEventListener("resize", handler);
    window.visualViewport?.addEventListener("scroll", handler);

    return () => {
      window.visualViewport?.removeEventListener("resize", handler);
      window.visualViewport?.removeEventListener("scroll", handler);
    };
  }, []);

  return {
    viewport,
  };
}