import { useState, useEffect } from 'react';

export const useStep1Form = (initialData = {}, editMode = false) => {
  const [formData, setFormData] = useState(initialData);
  const [trigger, setTrigger] = useState({});

  useEffect(() => {
    if (editMode) {
      setTrigger({ 1: true, 2: true, 3: true });
      return;
    }

    const newTrigger = {};
    
    if (formData?.priority !== undefined) {
      newTrigger[1] = true;
    }
    if (formData?.title !== undefined) {
      newTrigger[2] = true;
    }
    if (formData?.filter?.id === "5" || formData?.filter?.id === "8" || formData?.viewType) {
      newTrigger[3] = true;
    }

    setTrigger(newTrigger);
  }, [formData?.priority, formData?.title, formData?.viewType, formData?.filter, editMode]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  return {
    formData,
    setFormData,
    trigger,
    updateFormData,
    updateNestedFormData
  };
};
