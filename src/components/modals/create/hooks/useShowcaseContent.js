import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../dataFetch/axiosInstance';
import {
  baseUrl,
  CREATE_SHOWCASE_IMAGE,
  DELETE_SHOWCASE_IMAGE,
} from '../../../../helpers/api-routes';
import { configReq } from '../../../../helpers/functions';

export const useShowcaseContent = (token, showCaseLimit = 10) => {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState({
    title: '',
    description: '',
    link: '',
    priority: '',
    screenSize: false,
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const resetSelectedContent = useCallback(() => {
    setSelectedContent({
      title: '',
      description: '',
      link: '',
      priority: '',
      screenSize: false,
      image: null,
    });
    setSelectedImage(null);
    setSelectedGalleryImage(null);
  }, []);

  const handleContentChange = useCallback((field, value) => {
    setSelectedContent(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const addContent = useCallback(async (showCaseId, forEdit = false) => {
    try {
      if (!selectedContent.title) {
        toast.error('Please enter a title');
        return;
      }

      if (!selectedImage && !selectedGalleryImage) {
        toast.error('Please select an image');
        return;
      }

      if (forEdit) {
        const formData = new FormData();
        formData.append('showCaseId', showCaseId);
        formData.append('link', selectedContent.link);
        formData.append('priority', selectedContent.priority);
        formData.append('title', selectedContent.title);
        formData.append('description', selectedContent.description);
        formData.append('imageType', 1);
        formData.append('screenSize', selectedContent.screenSize ? 720 : 1200);

        if (selectedGalleryImage) {
          formData.append('fromGallery', selectedGalleryImage);
        }
        if (selectedImage) {
          formData.append('files', selectedImage);
        }

        await axiosInstance.post(
          `${baseUrl}/${CREATE_SHOWCASE_IMAGE}`,
          formData,
          configReq(token)
        );
      }

      const newContent = {
        ...selectedContent,
        id: Date.now(),
        image: selectedImage,
        galleryImage: selectedGalleryImage,
        imageType: 1,
      };

      setContents(prev => {
        // Find the first empty slot or slot with matching priority
        const index = selectedContent.priority !== '' 
          ? parseInt(selectedContent.priority)
          : prev.findIndex(item => !item);

        if (index >= 0 && index < showCaseLimit) {
          const newContents = [...prev];
          newContents[index] = newContent;
          return newContents;
        } else {
          toast.error('Invalid priority number');
          return prev;
        }
      });

      resetSelectedContent();
      toast.success('Content added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding content');
    }
  }, [selectedContent, selectedImage, selectedGalleryImage, showCaseLimit, resetSelectedContent]);

  const removeContent = useCallback(async (index, contentId, forEdit = false) => {
    try {
      if (forEdit && contentId) {
        await axiosInstance.delete(
          `${baseUrl}/${DELETE_SHOWCASE_IMAGE}/${contentId}`,
          configReq(token)
        );
      }

      setContents(prev => {
        const newContents = [...prev];
        newContents[index] = undefined;
        return newContents;
      });

      toast.success('Content removed successfully');
    } catch (error) {
      toast.error('Error removing content');
    }
  }, [token]);

  return {
    contents,
    setContents,
    selectedContent,
    selectedImage,
    setSelectedImage,
    selectedGalleryImage,
    setSelectedGalleryImage,
    handleContentChange,
    addContent,
    removeContent,
    resetSelectedContent,
  };
};
