import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl, CREATE_SHOWCASE } from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import axiosInstance from "../../../dataFetch/axiosInstance";
import { initialShowcaseState } from "../config/initialState";

export const useShowcaseForm = (token) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialShowcaseState);

  // Background settings state
  const [backgroundConfig, setBackgroundConfig] = useState({
    desktop: {
      avatar: null,
      selectedImage: null,
      settings: {
        possitionY: "center",
        possitionX: "center",
        size: "cover",
        opacity: 100,
      },
      needPreview: false,
    },
    mobile: {
      avatar: null,
      selectedImage: null,
      settings: {
        possitionY: "center",
        possitionX: "center",
        size: "cover",
        opacity: 100,
      },
      needPreview: false,
    },
  });

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateBackgroundConfig = useCallback((device, updates) => {
    setBackgroundConfig((prev) => ({
      ...prev,
      [device]: {
        ...prev[device],
        ...updates,
      },
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append basic form data
      formDataToSend.append("data", JSON.stringify(formData));

      // Append desktop background
      if (backgroundConfig.desktop.avatar) {
        formDataToSend.append(
          "desktopBackground",
          backgroundConfig.desktop.avatar
        );
      }
      if (backgroundConfig.desktop.selectedImage) {
        formDataToSend.append(
          "desktopBackgroundGallery",
          backgroundConfig.desktop.selectedImage
        );
      }

      // Append mobile background
      if (backgroundConfig.mobile.avatar) {
        formDataToSend.append(
          "mobileBackground",
          backgroundConfig.mobile.avatar
        );
      }
      if (backgroundConfig.mobile.selectedImage) {
        formDataToSend.append(
          "mobileBackgroundGallery",
          backgroundConfig.mobile.selectedImage
        );
      }

      const response = await axiosInstance.post(
        `${baseUrl}/${CREATE_SHOWCASE}`,
        formDataToSend,
        configReq(token)
      );

      if (response.status === 200) {
        toast.success("Showcase created successfully");
        navigate("/showcases");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating showcase");
    } finally {
      setLoading(false);
    }
  }, [formData, backgroundConfig, token, navigate]);

  const validateStep = useCallback(
    (step) => {
      switch (step) {
        case 1:
          return !!formData.url;
        case 2:
          return true; // Add validation if needed
        case 3:
          return true; // Add validation if needed
        default:
          return false;
      }
    },
    [formData]
  );

  return {
    currentStep,
    loading,
    formData,
    backgroundConfig,
    handleNext,
    handleBack,
    updateFormData,
    updateBackgroundConfig,
    handleSubmit,
    validateStep,
  };
};
