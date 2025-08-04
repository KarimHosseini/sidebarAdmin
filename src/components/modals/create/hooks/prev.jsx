import { Delete } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageTitle, TextEditor } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import Privew from "../../components/modals/create/preview";
import Step1ShowCase from "../../components/modals/create/step1";
import Step2ShowCase from "../../components/modals/create/step2";
import Step3ShowCase from "../../components/modals/create/step3";
import StepContent from "../../components/modals/create/stepContent";
import StoryContent from "../../components/modals/create/story";

import Counter from "../../components/modals/create/counter";
import StepContent2 from "../../components/modals/create/stepContent2";
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_SHOWCASE_IMAGE,
  DELETE_SHOWCASE,
  DELETE_SHOWCASE_IMAGE,
  DOWNLOAD_FILE,
  EDIT_SHOWCASE,
  GET_BLOG_CATEGORY,
  GET_BLOG_URL,
  GET_SHOWCASES,
  GET_SHOWCASES_TYPE,
  GET_SHOWCASES_URLS,
  PUBLIC_ATTRS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ShowCaseEdit = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [banner, setBanner] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categories2, setCategories2] = useState([]);
  const [showCaseType, setShowCaseType] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [contents, setContents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allData2, setAllData2] = useState([]);

  const [allProducts, setAllProducts] = useState([]);
  const [blogcategories, setBlogCategories] = useState([]);

  const [brands, setBrands] = useState([]);
  const [showCaseId, setShowCaseId] = useState();
  const [data, setData] = useState({
    hasContainer: true,
    color: "#fff",
    gridNumber: { id: 7, title: "4/4" },
    active: false,
    showCaseLimit: 7,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [allUrl, setAllUrl] = useState([
    "/",
    "blog",
    "archive",
    "cart",
    "payment-resualt",
    "privacy-and-policy",
    "products",
    "terms-and-conditions",
  ]);
  const [selectedProductImageM, setselectedProductImageM] = useState();
  const [selectedProductImage, setselectedProductImage] = useState();
  /*  const [mainselectedProductImageM, setmainselectedProductImageM] = useState();
  const [mainselectedProductImage, setmainselectedProductImage] = useState(); */
  const [firstSelectedProductImageM, setFirstSelectedProductImageM] =
    useState();
  const [firstSelectedProductImage, setFirstSelectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const [avatarM, setAvatarM] = useState();
  const [valueTab, setValueTab] = useState(0);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState({});
  const [selected, setSelected] = useState([]);
  const [bgSetting, setBgSetting] = useState({
    possitionY: "center",
    possitionX: "center",
    size: "cover",
  });
  const [bgSettingM, setBgSettingM] = useState({
    possitionY: "center",
    possitionX: "center",
    size: "cover",
  });
  const handleChangeB = (event, newValue) => {
    setValueTabB(newValue);
  };
  const [valueTabB, setValueTabB] = useState(0);
  const [needPreviewD, setNeedPreviewD] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [needPreviewM, setNeedPreviewM] = useState();

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { id } = useParams();
  const [tabs, setAllTabs] = useState([]);
  useEffect(() => {
    axiosInstance(`${baseUrl}/${GET_SHOWCASES_TYPE}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          setShowCaseType(data?.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, []);
  const getShowCAseData = () => {
    axiosInstance(`${baseUrl}/${GET_SHOWCASES}?id=${id}`, configReq(token))
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          var d = {};

          var f = JSON.parse(data?.data?.filterStyle);
          var gridType = GRID_TYPE.find((item) => item?.id === f?.gridType?.id);
          var gridNumber = GRID_NO.find(
            (item) => item?.id === data?.data?.gridNumber
          );
          var allTabs = [];
          var titlePosition = TITLE_POSITION.find(
            (item) => item?.id === f?.titlePosition
          );
          var filter = showCaseType?.find(
            (items) => Number(items?.id) === data?.data?.filterType
          );
          d = {
            ...data?.data,
            ...f,
            gridType: gridType,
            gridNumber,
            url:
              data?.data?.url?.slice(0, 1) === "/"
                ? data?.data?.url?.substring(1)
                : data?.data?.url,
            titlePosition: titlePosition,
            viewType: ALL_FILTER?.find(
              (items) => Number(items?.id) === data?.data?.viewType
            ),
            filter,
            color: data?.data?.backgroundColor,
          };

          var temp = [];
          data?.data?.gallery?.map((item) => {
            if (item?.imageType === 0) {
              if (item.screenSize === 0) {
                setNeedPreviewM(
                  `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`
                );
                setselectedProductImageM(item.galleryId);
                /*       setmainselectedProductImageM(item.galleryId); */
                setFirstSelectedProductImageM(item.id);
                if (item?.imageStyle) {
                  setBgSettingM(JSON.parse(item?.imageStyle));
                }
              } else {
                setNeedPreviewD(
                  `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`
                );
                setselectedProductImage(item.galleryId);
                /*     setmainselectedProductImage(item.galleryId); */
                setFirstSelectedProductImage(item.id);
                if (item?.imageStyle) {
                  setBgSetting(JSON.parse(item?.imageStyle));
                }
              }
            } else if (item?.imageType === 1) {
              temp.push(item);
            }
          });
          if (Number(data?.data?.viewType) === 1) {
            setBanner(temp);
          }
          if (data?.data?.filterType === 4) {
            var arr = [];
            var arrs = new Array(data?.data?.showCaseLimit * 2);
            var stories = new Array(f.storyLength);

            var cf = {};
            data?.data?.gallery?.map((item) => {
              var fs = item.imageStyle ? JSON.parse(item.imageStyle) : {};

              if (data?.data?.viewType === 57) {
                if (item?.imageType === 2) {
                  stories[fs.storyNumber] = {
                    banner: {
                      ...item,
                      Image: `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`,
                    },
                  };
                } else if (item?.imageType === 1) {
                  if (cf[fs.storyNumber]?.length > 0) {
                    cf[fs.storyNumber][item.priority] = {
                      ...item,
                      Image: `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`,
                      ...fs,
                    };
                  } else {
                    cf[fs.storyNumber] = [];
                    cf[fs.storyNumber][item.priority] = {
                      ...item,
                      Image: `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`,
                      ...fs,
                    };
                  }
                }
              } else {
                if (item?.imageType === 1) {
                  arr.push({ ...item, ...fs });
                  arrs[item.priority] = { ...item, ...fs };
                }
              }
            });

            for (var ai = 0; ai < f.storyLength; ai++) {
              if (stories[ai]) {
                stories[ai] = {
                  ...stories[ai],
                  content: cf[ai],
                  title: f.storyName ? f.storyName[ai] : "",
                };
              } else {
                stories[ai] = {
                  content: cf[ai],
                  title: f.storyName ? f.storyName[ai] : "",
                };
              }
            }

            setAllData(arr);
            setContents(arrs);
            setGallery(arr);
          } else if (data?.data?.filterType === 8) {
            var t = JSON.parse(data?.data?.filterValue);
            t.map((item) => {
              if (item?.filterItem) {
                const selected = item?.filterItem?.split(",").map((sl) => {
                  return { id: Number(sl) };
                });
                allTabs.push({
                  selected: selected ? selected : [],
                  valueTab: 1,
                  title: item?.title,
                });
              } else if (item?.filterValue) {
                const array = [];
                const sortArray = [];

                const regex =
                  /&filter\[(\d+)\]\[key]=(\w+)&filter\[\1\]\[value]=(\w+)&filter\[\1\]\[operator]=(\w+)/g;
                const sortRegex =
                  /&sort\[(\d+)\]\[key]=(\w+)&sort\[\1\]\[direction]=(\w+)/g;

                let match;
                var string = "&" + item?.filterValue;
                while ((match = regex.exec(string)) !== null) {
                  const index = parseInt(match[1]);
                  const name = match[2];
                  const value = match[3];
                  const type = match[4];

                  array[index] = {
                    name,
                    value,
                    type,
                  };
                }
                while ((match = sortRegex.exec(string)) !== null) {
                  const index = parseInt(match[1]);
                  const name = match[2];
                  const direction = match[3] === "asc";
                  sortArray[index] = {
                    name,
                    value: direction,
                  };
                }
                var st = {};
                if (sortArray && sortArray.length > 0) {
                  sortArray?.map((item) => {
                    st = { ...st, [item?.name]: item?.value };
                  });
                }
                allTabs.push({
                  filter: array,
                  allProducts: item?.data,
                  title: item?.title,
                  valueTab: 0,
                  sort: { ...st },
                });
              } else {
                allTabs.push({
                  filter: [],
                  sort: {},
                  valueTab: 0,
                  title: item?.title,
                });
              }
            });
          } else {
            setAllData(data?.data?.data);
            setAllData2(data?.data);
            if (data?.data?.filterItem) {
              setSelected(data?.data?.data || []);
              setValueTab(1);
            } else if (data?.data?.filterValue) {
              const array = [];
              const sortArray = [];

              const regex =
                /&filter\[(\d+)\]\[key]=(\w+)&filter\[\1\]\[value]=(\w+)&filter\[\1\]\[operator]=(\w+)/g;
              const sortRegex =
                /&sort\[(\d+)\]\[key]=(\w+)&sort\[\1\]\[direction]=(\w+)/g;

              let match;
              var string = "&" + data?.data?.filterValue;
              while ((match = regex.exec(string)) !== null) {
                const index = parseInt(match[1]);
                const name = match[2];
                const value = match[3];
                const type = match[4];

                array[index] = {
                  name,
                  value,
                  type,
                };
              }
              while ((match = sortRegex.exec(string)) !== null) {
                const index = parseInt(match[1]);
                const name = match[2];
                const direction = match[3] === "asc";
                sortArray[index] = {
                  name,
                  value: direction,
                };
              }
              if (sortArray && sortArray.length > 0) {
                var sorts = {};
                sortArray?.map((item) => {
                  sorts = { ...sorts, [item?.name]: item?.value };
                });
                setSort(sorts);
              }

              setFilter(array);
              setAllProducts(data?.data?.data);
            }
          }
          setAllTabs(allTabs);

          setData({ ...d, stories: stories });
          /*      setContents(temp);        */

          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!id || showCaseType.length === 0) return;
    setLoading(true);
    getShowCAseData();
    /*  setLoading(true); */ var tempUrl = [...allUrl];
    axiosInstance(
      `${baseUrl}/${GET_BLOG_URL}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        /*  setLoading(false); */

        data?.data.map((item) => {
          if (item.url?.slice(0, 1) === "/") {
            tempUrl.push(`/weblog${item.url}`);
          } else {
            tempUrl.push(`/weblog/${item.url}`);
          }
        });

        /*   setCategories(data);
          setCategories2(data?.data); */
      })
      .catch((err) => {
        /*   setLoading(false); */
      });
    axiosInstance(
      `${baseUrl}/${GET_SHOWCASES_URLS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);

        data?.data.map((item) => {
          if (item !== "/") {
            if (item.slice(0, 1) === "/") {
              tempUrl.push(item.substring(1));
            } else {
              tempUrl.push(item);
            }
          }
        });
      })
      .catch((err) => {
        setLoading(false);
      });
    setAllUrl(tempUrl);
    axiosInstance(
      `${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setCategories(data);
        setCategories2(data?.data);
      })
      .catch((err) => {
        /*   setLoading(false); */
      });

    axiosInstance(
      `${baseUrl}/${PUBLIC_ATTRS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          setAttributes(data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(
      `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          setBrands(data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
    axiosInstance(
      `${baseUrl}/${GET_BLOG_CATEGORY}?Page=${1}&Limit=${2000}`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;

        if (data.code === 200) {
          setBlogCategories(data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  }, [id, showCaseType]);
  useEffect(() => {
    if (tabs?.length > 0) {
      setData({ ...data, tabs: tabs, tabLength: tabs?.length });
    }
  }, [tabs]);
  const updateContent = () => {
    let fd = new FormData();
    var storyName = [];
    data?.stories?.map((item, index) => {
      storyName.push(item?.title ? item?.title : index);
    });
    fd.append("id", id);
    fd.append("title", data?.title || "-");
    if (data?.priority) fd.append("priority", data?.priority);
    fd.append("filterType", data?.filter?.id);
    fd.append("active", data?.active);
    fd.append(
      "url",
      data?.url === "/"
        ? "/"
        : data.url?.slice(0, 1) === "/"
        ? data.url
        : "/" + data.url
    );
    if (data?.viewType) fd.append("viewType", data?.viewType?.id);
    if (data?.showCaseLimit)
      fd.append("showCaseLimit", data?.showCaseLimit || null);
    if (data?.moreLink) fd.append("moreLink", data?.moreLink || null);
    fd.append("hasContainer", data?.hasContainer);
    if (data?.gridNumber) fd.append("gridNumber", data?.gridNumber?.id);
    fd.append(
      "filterStyle",
      JSON.stringify({
        row: data?.row,
        column: data?.column,
        gridType: data?.gridType,
        headerDivider: data?.headerDivider,
        showTitle: data?.showTitle,
        columnMobile: data?.columnMobile,
        gridGap: data?.gridGap,
        gridGapMobile: data?.gridGapMobile,
        paddingY: data?.paddingY,
        paddingX: data?.paddingX,
        borderWidth: data?.borderWidth,
        carouselNumber: data?.carouselNumber,
        borderRaduis: data?.borderRaduis,
        titlePosition: data?.titlePosition?.id,
        invert: data?.invert,

        gridTemplateColumn: data?.gridTemplateColumn,
        titleColor: data?.titleColor,
        marginTop: data?.marginTop,
        marginBottom: data?.marginBottom,
        paddingTop: data?.paddingTop,
        paddingBottom: data?.paddingBottom,
        paddingLeft: data?.paddingLeft,
        paddingRight: data?.paddingRight,
        sectionBorderTop: data?.sectionBorderTop || 0,
        sectionBorderRight: data?.sectionBorderRight || 0,
        sectionBorderBottom: data?.sectionBorderBottom || 0,
        sectionBorderLeft: data?.sectionBorderLeft || 0,
        borderSectionRaduisTop: data?.borderSectionRaduisTop || 0,
        borderSectionRaduisRight: data?.borderSectionRaduisRight || 0,
        borderSectionRaduisBottom: data?.borderSectionRaduisBottom || 0,
        borderSectionRaduisLeft: data?.borderSectionRaduisLeft || 0,
        elementBorderColor: data?.elementBorderColor,
        elementBorderTop: data?.elementBorderTop || 0,
        elementBorderRight: data?.elementBorderRight || 0,
        elementBorderBottom: data?.elementBorderBottom || 0,
        elementBorderLeft: data?.elementBorderLeft || 0,
        borderElementRaduisTop: data?.borderElementRaduisTop || 0,
        borderElementRaduisRight: data?.borderElementRaduisRight || 0,
        borderElementRaduisBottom: data?.borderElementRaduisBottom || 0,
        borderElementRaduisLeft: data?.borderElementRaduisLeft || 0,

        marginTopMobile: data?.marginTopMobile,
        marginBottomMobile: data?.marginBottomMobile,
        paddingTopMobile: data?.paddingTopMobile,
        paddingBottomMobile: data?.paddingBottomMobile,
        paddingLeftMobile: data?.paddingLeftMobile,
        paddingRightMobile: data?.paddingRightMobile,
        sectionBorderTopMobile: data?.sectionBorderTopMobile || 0,
        sectionBorderRightMobile: data?.sectionBorderRightMobile || 0,
        sectionBorderBottomMobile: data?.sectionBorderBottomMobile || 0,
        sectionBorderLeftMobile: data?.sectionBorderLeftMobile || 0,
        borderSectionColorMobile: data.borderSectionColorMobile,
        borderElementColorMobile: data.borderElementColorMobile,
        borderSectionRaduisTopMobile: data?.borderSectionRaduisTopMobile || 0,
        borderSectionRaduisRightMobile:
          data?.borderSectionRaduisRightMobile || 0,
        borderSectionRaduisBottomMobile:
          data?.borderSectionRaduisBottomMobile || 0,
        borderSectionRaduisLeftMobile: data?.borderSectionRaduisLeftMobile || 0,
        elementBorderColorMobile: data?.elementBorderColorMobile,
        elementBorderTopMobile: data?.elementBorderTopMobile || 0,
        elementBorderRightMobile: data?.elementBorderRightMobile || 0,
        elementBorderBottomMobile: data?.elementBorderBottomMobile || 0,
        elementBorderLeftMobile: data?.elementBorderLeftMobile || 0,
        borderElementRaduisTopMobile: data?.borderElementRaduisTopMobile || 0,
        borderElementRaduisRightMobile:
          data?.borderElementRaduisRightMobile || 0,
        borderElementRaduisBottomMobile:
          data?.borderElementRaduisBottomMobile || 0,
        borderElementRaduisLeftMobile: data?.borderElementRaduisLeftMobile || 0,

        shadow: data?.shadow,
        variant: data?.variant,
        borderSectionColor: data.borderSectionColor,
        borderElementColor: data.borderSectionColor,
        loop: data.loop,
        inContainer: data.inContainer,
        carouselSpeed: data.carouselSpeed,
        delaySpeed: data?.delaySpeed,
        storyLength: data?.storyLength,
        storyName: storyName,
        endDate: data?.endDate,
        labelColor: data?.labelColor,
        labelBackGround: data?.labelBackGround,
        valueColor: data?.valueColor,
        valueBackground: data?.valueBackground,
        borderCounterColor: data?.borderCounterColor,

        counterColor: data?.counterColor,
        promotionBg: data?.promotionBg,
        showPrice: data?.showPrice,
        showDelivery: data?.showDelivery,
        tomanIcon: data?.tomanIcon,
        showOldPrice: data?.showOldPrice,
        showPrecent: data?.showPrecent,
        showScore: data?.showScore,
        showColor: data?.showColor,
        showProductTitle: data?.showProductTitle,
        showImg: data?.showImg,
        showCounter: data?.showCounter,
        showPromotionIcon: data?.showPromotionIcon,
        showPromotion: data?.showPromotion,
        borderBottomPromotion: data?.borderBottomPromotion,
        borderBottomPromotionColor: data?.borderBottomPromotionColor,
      })
    );

    /*  ----------   set content base on filter value ------------- */

    /* if filter type is equal to category or brands  */

    if (
      data?.filter?.id === "0" ||
      data?.filter?.id === "1" ||
      data?.filter?.id === "6" ||
      data?.filter?.id === "7"
    ) {
      var all_id = "";
      allData.slice(0, data?.showCaseLimit).map((item) => {
        all_id += `,${item.id}`;
      });
      fd.append("filterItem", all_id.slice(1));
    } else if (data?.filter?.id === "2" || data?.filter?.id === "3") {
      /* if  filter type is equal to product or blogs */
      if (valueTab === 0) {
        var temp = "";
        filter.map((item, index) => {
          temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
        });
        if (sort) {
          var counter = 0;
          for (var prop in sort) {
            temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${
              sort[prop] ? "asc" : "desc"
            }`;
            counter++;
          }
        }
        if (temp) fd.append("filterValue", temp.slice(1));
      } else {
        var temp2 = "";
        selected.map((item) => {
          temp2 += `,${item.id}`;
        });
        fd.append("filterItem", temp2.slice(1));
      }
    } else if (data?.filter?.id === "5") {
      if (data?.filterValue) {
        fd.append("filterValue", data?.filterValue);
      }
    } else if (data?.filter?.id === "8") {
      var temp3 = [];
      data?.tabs?.map((item, index) => {
        if (item?.valueTab === 0) {
          var temp = "";
          item?.filter.map((item, index) => {
            temp += `&filter[${index}][key]=${item?.name}&filter[${index}][value]=${item?.value}&filter[${index}][operator]=${item?.type}`;
          });
          if (item?.sort) {
            var counter = 0;
            for (var prop in item?.sort) {
              temp += `&sort[${counter}][key]=${prop}&sort[${counter}][direction]=${
                item?.sort[prop] ? "asc" : "desc"
              }`;
              counter++;
            }
          }
          temp3.push({
            title: item?.title,
            priority: index,
            filterValue: temp ? temp.slice(1) : "",
          });
        } else {
          var temp2 = "";
          item?.selected.map((item) => {
            temp2 += `,${item.id}`;
          });

          temp3.push({
            title: item?.title,
            priority: index,
            filterItem: temp2 ? temp2.slice(1) : "",
          });
        }
      });

      fd.append("filterValue", JSON.stringify(temp3));
    }
    setLoading2(true);

    fd.append("backgroundColor", data?.color || data?.backgroundColor);

    axiosInstance
      .put(`${baseUrl}/${EDIT_SHOWCASE}`, fd, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
  };
  const updateImage = () => {};
  useEffect(() => {
    if (data?.filterItem && typeof data?.filterItem === "string") {
      if (data?.filter?.id === "0") {
        sorting(categories2);
      } else if (data?.filter?.id === "6" && attributes?.data) {
        sorting(attributes?.data);
      } else if (data?.filter?.id === "1" && brands?.data) {
        sorting(brands?.data);
      } else if (data?.filter?.id === "7" && blogcategories?.data) {
        sorting(blogcategories?.data);
      }
    }
  }, [
    data?.filterItem,
    categories2,
    attributes?.data,
    brands?.data,
    blogcategories?.data,
  ]);
  const sorting = (datass) => {
    const idsArray = data?.filterItem.split(",");
    var items = [...datass];
    items.sort((a, b) => {
      const aIndex = idsArray.indexOf(a.id.toString());
      const bIndex = idsArray.indexOf(b.id.toString());
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) {
        return -1;
      }
      if (bIndex !== -1) {
        return 1;
      }
      return 0;
    });
    setAllData(items);
    setAllData2({ data: items });
  };
  const deleteProduct = () => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_SHOWCASE}?id=${id}`, configReq(token))
      .then((res) => {
        setConfirmDelete(false);
        navigate("/showcases");
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        setConfirmDelete(false);
        toast.error(err.response?.data?.message);
      });
  };
  const UpdateBackground = () => {
    if (selectedProductImage /* !== mainselectedProductImage */ || avatar) {
      setLoading2(true);
      let fd2 = new FormData();
      fd2.append("showCaseId", id);
      fd2.append("screenSize", 1200);
      fd2.append("imageType", 0);
      fd2.append("priority", 1);
      fd2.append("imageStyle", JSON.stringify(bgSetting));
      if (avatar) fd2.append("files", avatar);
      if (selectedProductImage) fd2.append("fromGallery", selectedProductImage);

      if (firstSelectedProductImage) {
        axiosInstance
          .delete(
            `${baseUrl}/${DELETE_SHOWCASE_IMAGE}?id=${firstSelectedProductImage}`,
            configReq(token)
          )
          .then((res) => {
            uploadBackGround(fd2, false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
          });
      } else {
        uploadBackGround(fd2, false);
      }
    }
    if (selectedProductImageM /*  !== mainselectedProductImageM */ || avatarM) {
      setLoading2(true);
      let fd3 = new FormData();
      fd3.append("showCaseId", id);
      fd3.append("screenSize", 0);
      fd3.append("imageType", 0);
      fd3.append("priority", 1);
      fd3.append("imageStyle", JSON.stringify(bgSettingM));
      if (avatarM) fd3.append("files", avatarM);
      if (selectedProductImageM) {
        fd3.append("fromGallery", selectedProductImageM);
      }
      if (firstSelectedProductImageM) {
        axiosInstance
          .delete(
            `${baseUrl}/${DELETE_SHOWCASE_IMAGE}?id=${firstSelectedProductImageM}`,
            configReq(token)
          )
          .then((res) => {
            uploadBackGround(fd3, true);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
          });
      } else {
        uploadBackGround(fd3, true);
      }
    }
  };
  const updateGallery = () => {
    setLoading2(true);
    const filteredArray = contents
      .filter((n) => n)
      .filter(
        (item) => !gallery.some((secondItem) => secondItem.id === item.id)
      );

    filteredArray
      ?.filter((n) => n)
      ?.map((item, index) => {
        var nf = new FormData();
        nf.append("showCaseId", id);
        nf.append("screenSize", item?.screenSize);
        nf.append("imageType", 1);
        if (item?.link) nf.append("link", item?.link);
        if (item?.priority) nf.append("priority", item?.priority);
        if (item?.title) nf.append("title", item?.title);
        if (item?.description) nf.append("description", item?.description);

        nf.append(
          "imageStyle",
          JSON.stringify({
            possiton: item?.possiton,
            showTitle: item?.showTitle,
            titleColor: item?.titleColor,
          })
        );
        if (item?.avatar) nf.append("files", item?.avatar);
        if (item?.selectedProductImage)
          nf.append("fromGallery", item?.selectedProductImage);
        axiosInstance
          .post(`${baseUrl}/${CREATE_SHOWCASE_IMAGE}`, nf, configReq(token))
          .then((res) => {
            if (filteredArray?.length === index + 1) {
              setLoading2(false);
              toast.success("با موفقیت ثبت شد");
            }
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading2(false);
          });
      });
  };
  const uploadBackGround = (fd, mobile) => {
    axiosInstance
      .post(`${baseUrl}/${CREATE_SHOWCASE_IMAGE}`, fd, configReq(token))
      .then((res) => {
        if (!selectedProductImageM && !avatarM) {
          toast.success("با موفقیت ثبت شد");
        }
        if (mobile) {
          setFirstSelectedProductImageM(res.data.data.id);
        } else {
          setFirstSelectedProductImage(res.data.data.id);
        }
        getShowCAseData();
        setLoading2(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading2(false);
      });
  };
  return (
    <div>
      {" "}
      <>
        <PageTitle
          title={`ویرایش ${data?.title || ""}`}
          broadCrumb={[
            {
              title: "  مدیریت فرانت ",
              path: "/menu",
            },

            {
              title: "مدیریت ویترین های صفحات ",
              path: "/showcases",
            },
          ]}
        />
        <div className="md:mx-3 mx-1">
          <Paper elevation={0} sx={{ border: "1px solid #dbdfea" }}>
            <Tabs
              variant="scrollable"
              value={value}
              onChange={handleChange}
              sx={{
                flexGrow: 1,
                height: "3.07rem",
                minHeight: "40px !important",
                ".MuiTab-root": {
                  minHeight: "40px !important",
                },
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.04) !important"
                    : "rgba(0,0,0,0.7)  !important",
              }}
            >
              {addProductSteps.map((item, index) => (
                <Tab key={item} label={item} {...a11yProps(index)} />
              ))}
            </Tabs>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <div className="grid md:grid-cols-4 gap-5">
                {" "}
                {Array.from(Array(12).keys()).map((item, i) => (
                  <Skeleton
                    key={i + "fioerfhpew"}
                    height={30}
                    sx={{ width: "100%" /* , minWidth:{md:"160px"} */ }}
                  />
                ))}
              </div>
            ) : (
              <>
                {" "}
                {addProductSteps.map((item, index) => (
                  <TabPanel value={value} index={index} key={item.title}>
                    {item === "تعریف ویترین" ? (
                      <>
                        {data?.filter && (
                          <Step1ShowCase
                            data={data}
                            setData={setData}
                            ALL_FILTER={showCaseType}
                            setAllData={setAllData}
                            categories={categories}
                            categories2={categories2}
                            attributes={attributes}
                            nextStep={() => setCurrentStep(2)}
                            allUrl={allUrl}
                            editMode={true}
                          />
                        )}
                        <div className="w-full justify-between flex items-center py-3">
                          <IconButton
                            size="medium"
                            color="error"
                            onClick={() => setConfirmDelete(true)}
                          >
                            <Delete />
                          </IconButton>
                          <Button
                            disabled={loading2}
                            onClick={updateContent}
                            variant="contained"
                          >
                            {loading2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>
                        </div>
                      </>
                    ) : item === "تنظیمات پس زمینه" ? (
                      <>
                        <div className="w-full mb-2 justify-end flex items-center">
                          <Button
                            disabled={loading2}
                            onClick={() => {
                              valueTabB === 1
                                ? UpdateBackground()
                                : updateContent();
                            }}
                            variant="contained"
                          >
                            {loading2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                          </Button>
                        </div>
                        <Step2ShowCase
                          data={data}
                          setData={setData}
                          avatar={avatar}
                          setAvatar={setAvatar}
                          selectedProductImage={selectedProductImage}
                          setselectedProductImage={setselectedProductImage}
                          bgSetting={bgSetting}
                          setBgSetting={setBgSetting}
                          avatarM={avatarM}
                          setAvatarM={setAvatarM}
                          selectedProductImageM={selectedProductImageM}
                          setselectedProductImageM={setselectedProductImageM}
                          bgSettingM={bgSettingM}
                          setBgSettingM={setBgSettingM}
                          setNeedPreviewD={setNeedPreviewD}
                          setNeedPreviewM={setNeedPreviewM}
                          valueTab={valueTabB}
                          handleChange={handleChangeB}
                          hasRemoved={(t) => {
                            if (t === "M") {
                              setFirstSelectedProductImageM();
                            } else {
                              setFirstSelectedProductImage();
                            }
                          }}
                        />
                      </>
                    ) : item === "انتخاب محتوا" ? (
                      <>
                        <div className="w-full justify-end flex items-center mb-2">
                          {data?.viewType?.id === 20 ||
                          data?.viewType?.id === 9 ||
                          data?.viewType?.id === 57 ||
                          data?.viewType?.id === 11 ? (
                            <></>
                          ) : (
                            <>
                              {" "}
                              <Button
                                onClick={() => {
                                  data?.filter?.id !== "4"
                                    ? updateContent()
                                    : updateGallery();
                                }}
                                disabled={loading2}
                                variant="contained"
                              >
                                {loading2 ? (
                                  <CircularProgress />
                                ) : (
                                  <>ثبت اطلاعات</>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                        {data?.filter?.id === "0" ||
                        data?.filter?.id === "1" ||
                        data?.filter?.id === "6" ||
                        data?.filter?.id === "7" ? (
                          <StepContent2
                            data={data}
                            setData={setData}
                            ALL_FILTER={showCaseType}
                            setAllData={setAllData}
                            categories={categories}
                            categories2={categories2}
                            attributes={attributes}
                            brands={brands}
                            blogcategories={blogcategories}
                            currentValue={allData2}
                          />
                        ) : data?.filter?.id === "4" ? (
                          <>
                            {data?.viewType?.id === 57 ? (
                              <>
                                <StoryContent
                                  id={showCaseId}
                                  data={data}
                                  setData={setData}
                                  forEdit={true}
                                />
                              </>
                            ) : (
                              <>
                                {" "}
                                <Step3ShowCase
                                  contents={contents}
                                  setContents={(e) => {
                                    setContents(e);
                                    setAllData(e);
                                  }}
                                  id={id}
                                  datas={data}
                                  forEdit={true}
                                />
                              </>
                            )}
                          </>
                        ) : data?.filter?.id === "5" ? (
                          <div className="mb-5">
                            {" "}
                            <TextEditor
                              value={data?.filterValue}
                              change={(e) =>
                                setData({ ...data, filterValue: e })
                              }
                              hint="html "
                            />
                          </div>
                        ) : data?.filter?.id === "8" ? (
                          <>
                            <Counter data={data} setData={setData} />
                          </>
                        ) : (
                          <StepContent
                            data={data}
                            setData={setData}
                            forEdit={true}
                            showCaseId={setShowCaseId}
                            allData={allData}
                            valueTab={valueTab}
                            setValueTab={setValueTab}
                            filter={filter}
                            setFilter={setFilter}
                            sort={sort}
                            setSort={setSort}
                            selected={selected}
                            setSelected={setSelected}
                            setAllProducts={setAllProducts}
                            banner={banner}
                            setBanner={setBanner}
                          />
                        )}{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </TabPanel>
                ))}
              </>
            )}
          </Paper>
          <Privew
            data={data}
            needPreviewD={needPreviewD}
            needPreviewM={needPreviewM}
            bgSetting={bgSetting}
            bgSettingM={bgSettingM}
            allProducts={valueTab === 0 ? allProducts : []}
            selected={selected}
            currentStep={currentStep}
            allData={allData}
            contents={contents}
            editMode={true}
            banner={banner}
          />
        </div>
      </>
      <Confirm
        message="آیا از حذف این ویترین اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteProduct}
        open={confirmDelete}
      />
    </div>
  );
};

export default ShowCaseEdit;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { md: "20px" } }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const addProductSteps = ["تعریف ویترین", "تنظیمات پس زمینه", "انتخاب محتوا"];
const ALL_FILTER = [
  { id: 1, title: "carousel product with background" },
  { id: "1", title: "carousel product with background" },

  { id: 2, title: "carousel product" },
  { id: 3, title: "list product" },
  { id: 4, title: "grid product" },
  { id: 5, title: "scroll category" },
  { id: 6, title: "grid category" },
  { id: 14, title: "carousel brand" },
  { id: 15, title: "grid brand" },
  { id: 7, title: "carousel content" },
  { id: 8, title: "carousel content - inner text" },
  { id: 9, title: "banner grid - horizontal" },
  /*   { id: 10, title: "grid content - vertical" }, */
  { id: 11, title: "grid content" },
  { id: 31, title: "grid content" },
  { id: 12, title: "list content" },
  { id: 13, title: "content preview" },
  { id: 20, title: "slider" },
  { id: 55, title: "productBanner" },
  { id: 56, title: "productBanner" },

  { id: 57, title: "productBanner" },
  { id: 60, title: "productGenral" },
  { id: 61, title: "product2Genral" },
  { id: 62, title: "product3Genral" },
  { id: 63, title: "product4Genral" },
];
const GRID_TYPE = [
  { id: 1, title: "Standard" },
  { id: 2, title: "Quilted" },
  { id: 3, title: "Woven" },
  { id: 4, title: "Masonry" },
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
const TITLE_POSITION = [
  { id: 1, title: "right" },
  { id: 2, title: "center" },
  { id: 3, title: "left" },
];
