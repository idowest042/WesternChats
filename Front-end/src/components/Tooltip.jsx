import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let timeoutId;

  // Position calculations
  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      setIsMounted(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 150); // Wait for animation to complete
  };

  // Handle click outside for mobile/touch devices
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false);
        setTimeout(() => setIsMounted(false), 150);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (disabled) return;
          setIsVisible(!isVisible);
          setIsMounted(!isMounted);
        }}
        className="inline-block"
        aria-describedby={`tooltip-${content}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isMounted && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={positions[position]}
            className={`
              absolute z-50 whitespace-nowrap
              bg-base-content text-base-100 
              px-3 py-1.5 rounded-md text-sm
              shadow-lg pointer-events-none
              before:absolute before:border-4 before:border-transparent
              ${position === 'top' ? 'before:top-full before:left-1/2 before:-translate-x-1/2 before:border-t-base-content' : ''}
              ${position === 'bottom' ? 'before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-b-base-content' : ''}
              ${position === 'left' ? 'before:left-full before:top-1/2 before:-translate-y-1/2 before:border-l-base-content' : ''}
              ${position === 'right' ? 'before:right-full before:top-1/2 before:-translate-y-1/2 before:border-r-base-content' : ''}
            `}
            role="tooltip"
            id={`tooltip-${content}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;