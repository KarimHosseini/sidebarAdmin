import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../dataFetch/axiosInstance';
import { baseUrl, CREATE_SHOWCASE_IMAGE } from '../../../../helpers/api-routes';
import { configReq } from '../../../../helpers/functions';

export const useShowcaseSteps = (token) => {
  const [data, setData] = useState({});
  const [selectedProductImage, setSelectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const [contents, setContents] = useState([]);
  const [counter, setCounter] = useState(99999);

  const handleImageUpload = async (id, forEdit = false) => {
    try {
      if (forEdit) {
        const formData = new FormData();
        formData.append("showCaseId", id);
        formData.append("link", data?.link);
        formData.append("priority", data?.priority);
        formData.append("imageType", 1);
        formData.append("screenSize", data?.screenSize ? 720 : 1200);
        
        if (selectedProductImage) {
          formData.append("fromGallery", selectedProductImage);
        }
        if (avatar) {
          formData.append("files", avatar);
        }

        const response = await axiosInstance.post(
          `${baseUrl}/${CREATE_SHOWCASE_IMAGE}`,
          formData,
          configReq(token)
        );

        if (response.status === 200) {
          updateContents();
          return true;
        }
      } else {
        updateContents();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image');
      return false;
    }
  };

  const updateContents = () => {
    const newContent = {
      ...data,
      id: counter,
      avatar,
      selectedProductImage,
      imageType: 1,
    };

    setContents(prev => [...prev, newContent]);
    setCounter(prev => prev + 1);
    resetForm();
  };

  const resetForm = () => {
    setData({
      title: "",
      description: "",
      link: "",
      priority: "",
      screenSize: false,
      Image: null,
    });
    setAvatar(undefined);
    setSelectedProductImage(undefined);
  };

  const saveContentData = (contentData, index, isMobile, showcaseLimit) => {
    if (contents.length === 0) {
      const newContents = new Array(showcaseLimit * 2);
      newContents[index] = {
        ...contentData,
        screenSize: isMobile ? 0 : 1200,
        priority: index,
      };
      setContents(newContents);
    } else {
      setContents(prev => {
        const updated = [...prev];
        updated[index] = {
          ...contentData,
          screenSize: isMobile ? 0 : 1200,
          priority: index,
        };
        return updated;
      });
    }
  };

  return {
    data,
    setData,
    selectedProductImage,
    setSelectedProductImage,
    avatar,
    setAvatar,
    contents,
    setContents,
    handleImageUpload,
    saveContentData,
    resetForm,
  };
};
