import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_SHOWCASE,
  CREATE_SHOWCASE_IMAGE,
  DELETE_SHOWCASE,
  DELETE_SHOWCASE_IMAGE,
  EDIT_SHOWCASE,
  GET_BLOG_CATEGORY,
  GET_BLOG_URL,
  GET_SHOWCASES_TYPE,
  GET_SHOWCASES_URLS,
  PUBLIC_ATTRS,
  UPDATE_SHOWCASE_IMAGE,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import axiosInstance from "../../../dataFetch/axiosInstance";

export const useShowcaseApi = (token, fetch = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [categories, setCategories] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [showCaseType, setShowCaseType] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [brands, setBrands] = useState([]);
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
  const navigate = useNavigate();
  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch blog URLs
      const blogUrlRes = await axiosInstance.get(
        `${baseUrl}/${GET_BLOG_URL}?Page=1&Limit=2000`,
        configReq(token)
      );
      setAllUrl((prev) => [
        ...prev,
        ...blogUrlRes.data.data.map((url) => url.url),
      ]);

      // Fetch showcase URLs
      const showcaseUrlRes = await axiosInstance.get(
        `${baseUrl}/${GET_SHOWCASES_URLS}?Page=1&Limit=2000`,
        configReq(token)
      );
      setAllUrl((prev) => [...prev, ...showcaseUrlRes.data.data]);

      // Fetch categories
      const categoriesRes = await axiosInstance.get(
        `${baseUrl}/${CATEGORIES}?Page=1&Limit=2000`,
        configReq(token)
      );
      setCategories(categoriesRes.data.data);

      // Fetch blog categories
      const blogCategoriesRes = await axiosInstance.get(
        `${baseUrl}/${GET_BLOG_CATEGORY}?Page=1&Limit=2000`,
        configReq(token)
      );
      setBlogCategories(blogCategoriesRes.data.data);

      // Fetch showcase types
      const showcaseTypesRes = await axiosInstance.get(
        `${baseUrl}/${GET_SHOWCASES_TYPE}`,
        configReq(token)
      );
      setShowCaseType(showcaseTypesRes.data.data);

      // Fetch attributes
      const attributesRes = await axiosInstance.get(
        `${baseUrl}/${PUBLIC_ATTRS}?Page=1&Limit=2000`,
        configReq(token)
      );
      setAttributes(attributesRes.data.data);

      // Fetch brands
      const brandsRes = await axiosInstance.get(
        `${baseUrl}/${BRANDS}`,
        configReq(token)
      );
      setBrands(brandsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
      toast.error(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create showcase
  const createShowcase = async (
    data,
    allData,
    backgroundSettings,
    filter,
    sort,
    selected,
    valueTab,
    desktopContents,
    mobileContents,
    banner
  ) => {
    setLoading(true);
    setError(null);
    let fd = new FormData();

    var storyName = [];
    data?.stories?.map((item, index) => {
      storyName.push(item?.title ? item?.title : index);
    });
    fd.append("title", data?.title || "-");
    if (data?.priority) fd.append("priority", data?.priority);
    fd.append("filterType", data?.filter?.id);
    fd.append("active", data?.active);
    fd.append("backgroundColor", "#fff");

    fd.append(
      "url",
      data?.url
        ? data?.url === "/"
          ? "/"
          : data.url?.slice(0, 1) === "/"
          ? data.url
          : "/" + data.url
        : "/"
    );
    fd.append("viewType", data?.viewType?.id || "0");
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
        borderSectionColor: data.borderSectionColor,
        borderElementColor: data.borderElementColor,
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
        className: data?.className,
      })
    );

    if (
      data?.filter?.id === "0" ||
      data?.filter?.id === "1" ||
      data?.filter?.id === "6" ||
      data?.filter?.id === "7"
    ) {
      var all_id = "";
      allData?.slice(0, data?.showCaseLimit).map((item) => {
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
          var temp4 = "";

          item?.selected.map((item) => {
            temp4 += `,${item.id}`;
          });
          temp3.push({
            title: item?.title,
            priority: index,
            filterItem: temp4 ? temp4.slice(1) : "",
          });
        }
      });
      fd.append("filterValue", JSON.stringify(temp3));
    }

    try {
      const response = await axiosInstance.post(
        `${baseUrl}/${CREATE_SHOWCASE}`,
        fd,
        configReq(token)
      );
      if (
        backgroundSettings.desktop.selectedProductImage ||
        backgroundSettings.desktop.avatar
      ) {
        let fd3 = new FormData();
        fd3.append("showCaseId", response?.data?.data?.id);
        fd3.append("screenSize", 1200);
        fd3.append("imageType", 0);
        fd3.append("priority", 1);
        fd3.append(
          "imageStyle",
          JSON.stringify(backgroundSettings.desktop.settings)
        );
        if (backgroundSettings.desktop.avatar)
          fd3.append("files", backgroundSettings.desktop.avatar);
        if (backgroundSettings.desktop.selectedProductImage) {
          fd3.append(
            "fromGallery",
            backgroundSettings.desktop.selectedProductImage
          );
        }
        uploadShowcaseImage(fd3);
      }
      if (
        backgroundSettings.mobile.selectedProductImage ||
        backgroundSettings.mobile.avatar
      ) {
        let fd3 = new FormData();
        fd3.append("showCaseId", response?.data?.data?.id);
        fd3.append("screenSize", 0);
        fd3.append("imageType", 0);
        fd3.append("priority", 1);
        fd3.append(
          "imageStyle",
          JSON.stringify(backgroundSettings.mobile.settings)
        );
        if (backgroundSettings.mobile.avatar)
          fd3.append("files", backgroundSettings.mobile.avatar);
        if (backgroundSettings.mobile.selectedProductImage) {
          fd3.append(
            "fromGallery",
            backgroundSettings.mobile.selectedProductImage
          );
        }
        uploadShowcaseImage(fd3);
      }
      if (desktopContents && desktopContents.length > 0) {
        desktopContents.map((item, index) => {
          let fd3 = new FormData();
          fd3.append("showCaseId", response?.data?.data?.id);
          fd3.append("screenSize", 1200);
          fd3.append("imageType", 1);
          fd3.append("priority", item.priority || index + 1);
          fd3.append(
            "imageStyle",
            JSON.stringify({
              position: item.position,
              priority: item.priority,
              right: item.right,
              showTitle: item.showTitle,

              titleColor: item.titleColor,

              top: item.top,
            })
          );
          if (item.title) fd3.append("title", item.title);
          if (item.description) fd3.append("description", item.description);
          if (item.link) fd3.append("link", item.link);
          if (item.avatar) fd3.append("files", item.avatar);
          if (item.selectedProductImage) {
            fd3.append("fromGallery", item.selectedProductImage);
          }
          uploadShowcaseImage(fd3);
        });
      }
      if (mobileContents && mobileContents.length > 0) {
        mobileContents.map((item, index) => {
          let fd3 = new FormData();
          fd3.append("showCaseId", response?.data?.data?.id);
          fd3.append("screenSize", 0);
          fd3.append("imageType", 1);
          fd3.append("priority", item.priority || index + 1);
          fd3.append(
            "imageStyle",
            JSON.stringify({
              position: item.position,
              priority: item.priority,
              right: item.right,
              showTitle: item.showTitle,
              description: item.description,

              titleColor: item.titleColor,

              top: item.top,
            })
          );
          if (item.title) fd3.append("title", item.title);
          if (item.description) fd3.append("description", item.description);
          if (item.link) fd3.append("link", item.link);
          if (item.avatar) fd3.append("files", item.avatar);
          if (item.selectedProductImage) {
            fd3.append("fromGallery", item.selectedProductImage);
          }
          uploadShowcaseImage(fd3);
        });
      }
      if (banner && banner.length > 0) {
        banner.map((item, index) => {
          let fd3 = new FormData();
          fd3.append("showCaseId", response?.data?.data?.id);
          fd3.append("screenSize", item.screenSize);
          fd3.append("imageType", 1);
          fd3.append("priority", item.priority || index + 1);
          fd3.append(
            "imageStyle",
            JSON.stringify({
              position: item.position,
              priority: item.priority,
              right: item.right,
              showTitle: item.showTitle,

              titleColor: item.titleColor,

              top: item.top,
            })
          );
          if (item.title) fd3.append("title", item.title);
          if (item.description) fd3.append("description", item.description);
          if (item.link) fd3.append("link", item.link);
          if (item.avatar) fd3.append("files", item.avatar);
          if (item.selectedProductImage) {
            fd3.append("fromGallery", item.selectedProductImage);
          }
          uploadShowcaseImage(fd3);
        });
      }
      toast.success("با موفقیت ساخته شد  ");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error creating showcase";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // edit showcase
  const editShowcase = async (
    data,
    allData,
    filter,
    sort,
    selected,
    valueTab,
    id
  ) => {
    setLoading(true);
    setError(null);
    let fd = new FormData();

    var storyName = [];
    data?.stories?.map((item, index) => {
      storyName.push(item?.title ? item?.title : index);
    });
    fd.append("title", data?.title || "-");
    if (data?.priority) fd.append("priority", data?.priority);
    fd.append("filterType", data?.filter?.id);
    fd.append("active", data?.active);
    fd.append(
      "url",
      data?.url
        ? data?.url === "/"
          ? "/"
          : data.url?.slice(0, 1) === "/"
          ? data.url
          : "/" + data.url
        : "/"
    );
    fd.append("backgroundColor", "#fff");

    fd.append("viewType", data?.viewType?.id || "0");
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
        borderSectionColor: data.borderSectionColor,
        borderElementColor: data.borderElementColor,
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
        className: data?.className,
      })
    );

    if (
      data?.filter?.id === "0" ||
      data?.filter?.id === "1" ||
      data?.filter?.id === "6" ||
      data?.filter?.id === "7"
    ) {
      var all_id = "";
      allData?.slice(0, data?.showCaseLimit).map((item) => {
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
          var temp4 = "";

          item?.selected.map((item) => {
            temp4 += `,${item.id}`;
          });
          temp3.push({
            title: item?.title,
            priority: index,
            filterItem: temp4 ? temp4.slice(1) : "",
          });
        }
      });
      fd.append("filterValue", JSON.stringify(temp3));
    }
    fd.append("id", id);
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/${EDIT_SHOWCASE}`,
        fd,
        configReq(token)
      );

      toast.success("با موفقیت ویرایش شد  ");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error creating showcase";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload showcase image
  const uploadShowcaseImage = async (imageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/${CREATE_SHOWCASE_IMAGE}`,
        imageData,
        configReq(token)
      );
      return response.data.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error uploading image";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // edit showCaseImage
  const editShowcaseImage = async (item, id) => {
    setLoading(true);
    setError(null);
    let fd3 = new FormData();
    fd3.append("showCaseId", id);
    fd3.append("id", item.id);
    fd3.append("screenSize", item.screenSize);
    fd3.append("imageType", 1);
    fd3.append(
      "priority",
      item.priority && !isNaN(Number(item.priority)) ? item.priority : "1"
    );
    fd3.append(
      "imageStyle",
      JSON.stringify({
        position: item.position,
        priority: item.priority || "0",
        right: item.right,
        showTitle: item.showTitle,
        description: item.description,

        titleColor: item.titleColor,

        top: item.top,
      })
    );
    if (item.title) fd3.append("title", item.title);
    if (item.description) fd3.append("description", item.description);
    if (item.link) fd3.append("link", item.link);
    if (item.avatar) fd3.append("files", item.avatar);
    if (item.selectedProductImage) {
      fd3.append("fromGallery", item.selectedProductImage);
    }
    try {
      const response = await axiosInstance.put(
        `${baseUrl}/${UPDATE_SHOWCASE_IMAGE}`,
        fd3,
        configReq(token)
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error uploading image";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // delete showCaseImage
  const deleteShowcaseImage = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${baseUrl}/${DELETE_SHOWCASE_IMAGE}?id=${id}`,
        configReq(token)
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error uploading image";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // delete showCase
  const deleteShowcase = async (id) => {
    axiosInstance
      .delete(`${baseUrl}/${DELETE_SHOWCASE}?id=${id}`, configReq(token))
      .then((res) => {
        navigate("/showcases");
        toast.success("با موفقیت حذف شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  useEffect(() => {
    if (fetch) {
      fetchInitialData();
    }
  }, [fetchInitialData, fetch]);

  return {
    loading,
    error,
    categories,
    blogCategories,
    showCaseType,
    attributes,
    brands,
    allUrl,
    createShowcase,
    uploadShowcaseImage,
    editShowcase,
    deleteShowcase,
    editShowcaseImage,
    deleteShowcaseImage,
  };
};
