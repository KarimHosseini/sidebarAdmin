import { useState } from "react";

export const useShowcaseState = (initialData = {}) => {
  // Main form data state
  const [data, setData] = useState({
    hasContainer: true,
    color: "rgba(255,255,255,0)",
    gridNumber: { id: 7, title: "4/4" },
    active: false,
    showCaseLimit: 7,
    showTitle: true,
    gridGap: 10,
    gridGapMobile: 10,
    column: 2,
    columnMobile: 1,
    paddingY: 10,
    paddingX: 0,
    borderRaduis: 0,
    borderWidth: 0,
    carouselNumber: 5,
    titlePosition: { id: 1, title: "right" },
    moreLink: "/",
    shadow: "rgba(255,255,255,0)",
    ...initialData,
  });

  // Background settings state
  const [backgroundSettings, setBackgroundSettings] = useState({
    desktop: {
      selectedImage: null,
      avatar: null,
      settings: {
        possitionY: "center",
        possitionX: "center",
        size: "cover",
        opacity: 100,
      },
      needPreview: false,
    },
    mobile: {
      selectedImage: null,
      avatar: null,
      settings: {
        possitionY: "center",
        possitionX: "center",
        size: "cover",
        opacity: 100,
      },
      needPreview: false,
    },
  });

  // Content state
  const [contents, setContents] = useState([]);
  const [banner, setBanner] = useState([]);

  // Tab states
  const [valueTab, setValueTab] = useState(0);
  const [valueTabB, setValueTabB] = useState(0);

  // Filter and sort states
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [selected, setSelected] = useState([]);

  // Update functions
  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const updateBackgroundSettings = (data) => {
    setBackgroundSettings(data);
  };

  const updateContents = (newContents) => {
    setContents(newContents);
  };

  const addContent = (content) => {
    setContents((prev) => [...prev, content]);
  };

  const removeContent = (index) => {
    setContents((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    data,
    updateData,
    backgroundSettings,
    updateBackgroundSettings,
    contents,
    updateContents,
    addContent,
    removeContent,
    banner,
    setBanner,
    valueTab,
    setValueTab,
    valueTabB,
    setValueTabB,
    filter,
    setFilter,
    sort,
    setSort,
    selected,
    setSelected,
  };
};
