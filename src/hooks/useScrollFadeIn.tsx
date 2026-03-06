import { useEffect, useRef, useCallback } from "react";

const useScrollFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    // Use MutationObserver to handle dynamically loaded content
    const el = ref.current;
    if (!el) return;
    
    const observeElements = () => {
      const elements = el.querySelectorAll(".fade-up:not(.visible)");
      elements.forEach((e) => observerRef.current?.observe(e));
    };
    
    observeElements();
    
    // Watch for new elements added to the DOM
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(el, { childList: true, subtree: true });
    
    return () => mutationObserver.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = setupObserver();
    return () => {
      cleanup?.();
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  return ref;
};

export default useScrollFadeIn;
