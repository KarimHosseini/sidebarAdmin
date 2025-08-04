/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Borders from "./step1Contents/borders";
import Contents from "./step1Contents/content";
import Grids from "./step1Contents/grids";
import Initail from "./step1Contents/initail";
import ProductsCarts from "./step1Contents/productCart";
import Sections from "./step1Contents/sections";
import Stories from "./step1Contents/stories";
import Title from "./step1Contents/title";

const Step1ShowCase = ({ data, setData, ALL_FILTER, allUrl, editMode }) => {
  const [triger, setTriger] = useState({});
  useEffect(() => {
    if (editMode) {
      setTriger({ 1: true, 2: true, 3: true });
    } else {
      var t = { ...triger };
      if (data?.priority !== undefined) {
        t = { ...t, 1: true };
      }
      if (data?.title !== undefined) {
        t = { ...t, 2: true };
      }
      if (data?.filter?.id === "5" || data?.filter?.id === "8") {
        t = { ...t, 3: true };
      }
      if (data?.viewType) {
        t = { ...t, 3: true };
      }
      setTriger({ ...t });
    }
  }, [data?.priority, data?.title, data?.viewType, data?.filter]);
  return (
    <div className="grid md:grid-cols-12 gap-4 mt-7">
      <Initail data={data} setData={setData} allUrl={allUrl} />
      <Title
        data={data}
        setData={setData}
        triger={triger}
        TITLE_POSITION={TITLE_POSITION}
      />
      <Contents
        data={data}
        setData={setData}
        triger={triger}
        ALL_FILTER={ALL_FILTER}
        editMode={editMode}
        CATEGORY_VIEW={CATEGORY_VIEW}
        BRAND_VIEW={BRAND_VIEW}
        PRODUCT_VIEW={PRODUCT_VIEW}
        CONTENT_VIEW2={CONTENT_VIEW2}
        CONTENT_VIEW={CONTENT_VIEW}
        GRID_TYPE={GRID_TYPE}
      />
      <Sections
        data={data}
        setData={setData}
        triger={triger}
        // editMode={editMode}
        GRID_NO={GRID_NO}
      />
      <Borders data={data} setData={setData} triger={triger} />
      <Grids data={data} setData={setData} />
      <Stories data={data} setData={setData} triger={triger} />
      <ProductsCarts data={data} setData={setData} />
    </div>
  );
};

export default React.memo(Step1ShowCase);

const PRODUCT_VIEW = [
  {
    id: 1,
    title: "کروسل با پس زمینه ",
  },
  {
    id: 2,
    title: "کروسل",
  },
  {
    id: 60,
    title: "کروسل جنرال",
  },
  {
    id: 62,
    title: "کروسل جنرال افقی",
  },
  {
    id: 4,
    title: "گرید",
  },
  {
    id: 61,
    title: "گرید جنرال",
  },
  {
    id: 63,
    title: "گرید جنرال افقی",
  },
  { id: 3, title: "لیست", image: null },
  { id: 55, title: "بنر", image: null },
];
const CATEGORY_VIEW = [
  {
    id: 5,
    title: " کروسل",
  },
  {
    id: 6,
    title: " گرید",
  },
];
const BRAND_VIEW = [
  {
    id: 14,
    title: " کروسل",
  },
  {
    id: 15,
    title: " گرید",
  },
];
const CONTENT_VIEW = [
  {
    id: 7,
    title: " کروسل",
  },
  {
    id: 8,
    title: "کروسل نوشته داخلی",
  },
  {
    id: 9,
    title: "گرید (اسلایدر موبایل)",
  },
  {
    id: 31,
    title: "گرید ",
  },
  { id: 12, title: "لیست ", image: null },
  { id: 13, title: "حالت نمایشی ", image: null },
];
const CONTENT_VIEW2 = [
  { id: 20, title: "اسلایدر" },
  {
    id: 9,
    title: "گرید (اسلایدر موبایل)",
  },
  {
    id: 11,
    title: " گرید",
  },
  {
    id: 57,
    title: " استوری",
  },
];
const GRID_NO = [
  { id: 1, title: "1/2" },
  { id: 2, title: "1/3" },
  { id: 3, title: "2/3" },
  { id: 4, title: "1/4" },
  { id: 5, title: "2/4" },
  { id: 6, title: "3/4" },
  { id: 7, title: "4/4" },
];
const GRID_TYPE = [
  { id: 1, title: "شبکه منظم" },
  { id: 2, title: "تتریسی" },
  { id: 3, title: "ریتمیک" },
  { id: 4, title: "سنگ چین" },
];
const TITLE_POSITION = [
  { id: 1, title: "right" },
  { id: 2, title: "center" },
  { id: 3, title: "left" },
];
