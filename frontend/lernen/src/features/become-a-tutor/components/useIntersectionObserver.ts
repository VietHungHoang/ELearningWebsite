import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

interface IntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = '0%',
  }: IntersectionObserverOptions
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Check if intersection ratio meets threshold
        if (entry.isIntersecting && entry.intersectionRatio >= threshold && !hasTriggered) {
          hasTriggered = true;
          setIsIntersecting(true);
          observer.unobserve(element); // Stop observing once it's visible
        }
      },
      { threshold, root, rootMargin }
    );

    // Check initial state immediately
    observer.observe(element);
    
    // Also check after a small delay to catch elements already in viewport
    const timeoutId = setTimeout(() => {
      if (hasTriggered) {
        return;
      }
      
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      
      const isInViewport = 
        rect.top < viewportHeight &&
        rect.bottom > 0 &&
        rect.left < viewportWidth &&
        rect.right > 0;
      
      if (isInViewport) {
        hasTriggered = true;
        setIsIntersecting(true);
        observer.unobserve(element);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin]);

  return isIntersecting;
};

export default useIntersectionObserver;

