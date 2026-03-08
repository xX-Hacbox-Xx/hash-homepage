import { useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback, useRef } from 'react';

export function useScrollToHash() {
  const scrollTimeout = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const scrollToHash = useCallback(
    (hash, onDone) => {
      const id = hash.split('#')[1];
      const targetElement = document.getElementById(id);

      // 👉 加上这一行：如果找不到该元素，就直接退出，不要报错
      if (!targetElement) return;
      
      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      const handleScroll = () => {
        clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === location.pathname) {
            onDone?.();
            navigate(`${location.pathname}#${id}`, { scroll: false });
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout.current);
      };
    },
    [navigate, reduceMotion, location.pathname]
  );

  return scrollToHash;
}
