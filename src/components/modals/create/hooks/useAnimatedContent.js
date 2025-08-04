import { useState, useEffect } from 'react';
import { ANIMATION_CONFIG } from '../config/messages';

export const useAnimatedContent = (initialVisible = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [animationState, setAnimationState] = useState(ANIMATION_CONFIG.FADE.initial);

  useEffect(() => {
    if (isVisible) {
      setAnimationState(ANIMATION_CONFIG.FADE.animate);
    } else {
      setAnimationState(ANIMATION_CONFIG.FADE.exit);
    }
  }, [isVisible]);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  
  const getAnimationProps = (type = 'FADE') => {
    return {
      initial: ANIMATION_CONFIG[type].initial,
      animate: animationState,
      exit: ANIMATION_CONFIG[type].exit,
      transition: {
        duration: ANIMATION_CONFIG.DURATION / 1000, // Convert to seconds
        ease: ANIMATION_CONFIG.EASING,
      },
    };
  };

  return {
    isVisible,
    show,
    hide,
    getAnimationProps,
  };
};
