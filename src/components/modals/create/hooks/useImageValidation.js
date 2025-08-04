import { useState } from 'react';
import { IMAGE_CONFIG, MESSAGES } from '../config/messages';

export const useImageValidation = (isMobile = false) => {
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateAspectRatio = (width, height, config) => {
    const actualRatio = width / height;
    const targetRatio = config.ASPECT_RATIO;
    const tolerance = config.ASPECT_RATIO_TOLERANCE;
    
    return Math.abs(actualRatio - targetRatio) <= tolerance;
  };

  const validateFileType = (file) => {
    return IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type);
  };

  const validateImage = async (file) => {
    setIsValidating(true);
    setError('');

    try {
      // Validate file type
      if (!validateFileType(file)) {
        setError(MESSAGES.ERRORS.IMAGE_FORMAT);
        return false;
      }

      // Validate file size
      const config = isMobile ? IMAGE_CONFIG.MOBILE : IMAGE_CONFIG.DESKTOP;
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > config.MAX_SIZE_MB) {
        setError(MESSAGES.ERRORS.IMAGE_SIZE);
        return false;
      }

      // Validate dimensions and aspect ratio
      return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          
          // Check dimensions
          if (img.width < config.MIN_WIDTH || img.height < config.MIN_HEIGHT) {
            const error = isMobile 
              ? MESSAGES.ERRORS.IMAGE_DIMENSIONS.MOBILE 
              : MESSAGES.ERRORS.IMAGE_DIMENSIONS.DESKTOP;
            setError(error);
            reject(new Error(error));
            return;
          }

          // Check aspect ratio
          if (!validateAspectRatio(img.width, img.height, config)) {
            const error = isMobile
              ? MESSAGES.ERRORS.IMAGE_ASPECT_RATIO.MOBILE
              : MESSAGES.ERRORS.IMAGE_ASPECT_RATIO.DESKTOP;
            setError(error);
            reject(new Error(error));
            return;
          }

          setError('');
          resolve(true);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setError(MESSAGES.ERRORS.UPLOAD_FAILED);
          reject(new Error(MESSAGES.ERRORS.UPLOAD_FAILED));
        };

        img.src = objectUrl;
      });
    } catch (error) {
      setError(error.message || MESSAGES.ERRORS.UPLOAD_FAILED);
      return false;
    } finally {
      setIsValidating(false); // Corrected this line
    }
  };

  const clearError = () => setError('');

  return {
    error,
    isValidating,
    validateImage,
    clearError,
  };
};
