import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  baseUrl,
  DOWNLOAD_FILE,
  GET_SHOWCASES,
} from "../../../../helpers/api-routes";
import { configReq } from "../../../../helpers/functions";
import axiosInstance from "../../../dataFetch/axiosInstance";

export const useGetShowCaseData = (
  token,
  id,
  showCaseType,
  categories,
  blogCategories,
  attributes,
  brands,
  setValueTab,
  setSelected,
  setSort,
  setFilter,
  setAllProducts,
  setDesktopContents,
  setMobileContents,
  updateBackgroundSettings,
  setBanner
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState({});
  const [tabs, setAllTabs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allData2, setAllData2] = useState([]);

  const [contents, setContents] = useState([]);
  const fetchData = () => {
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
          var background = {
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
          };
          var banner = [];
          data?.data?.gallery?.map((item) => {
            /*  */
            if (item?.imageType === 0) {
              const ss = item.imageStyle ? JSON.parse(item.imageStyle) : {};
              if (item.screenSize === 0) {
                background = {
                  ...background,
                  mobile: {
                    selectedProductImage: item.galleryId,
                    selectedImage: `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`,
                    settings: ss,
                    id: item.id,
                  },
                };
              } else {
                background = {
                  ...background,
                  desktop: {
                    selectedProductImage: item.galleryId,
                    selectedImage: `${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}`,
                    settings: ss,
                    id: item.id,
                  },
                };
              }
            } else if (
              data?.data?.viewType === 1 &&
              data?.data?.filterType === 2
            ) {
              const ss = item.imageStyle ? JSON.parse(item.imageStyle) : {};

              banner.push({ ...item, ...ss });
            } else if (item?.imageType === 1) {
              temp.push(item);
            }
          });
          setBanner(banner);
          updateBackgroundSettings(background);
          if (Number(data?.data?.viewType) === 1) {
            //setBanner(temp);
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
                    return st;
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

          setFetchedData({ ...d, stories: stories });
          const desktopContent = [];
          const mobileContent = [];
          temp.forEach((it) => {
            const styles = it.imageStyle ? JSON.parse(it.imageStyle) : {};
            if (it.screenSize) {
              desktopContent.push({
                ...it,
                ...styles,
                Image: `${baseUrl}/${DOWNLOAD_FILE}/${it.galleryId}`,
                avatar: null,
                selectedProductImage: it.galleryId,
              });
            } else {
              mobileContent.push({
                ...it,
                ...styles,
                Image: `${baseUrl}/${DOWNLOAD_FILE}/${it.galleryId}`,
                avatar: null,
                selectedProductImage: it.galleryId,
              });
            }
          });
          setDesktopContents(desktopContent);
          setMobileContents(mobileContent);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (token && id && showCaseType?.length > 0) {
      fetchData();
    }
  }, [token, id, showCaseType]);
  useEffect(() => {
    if (tabs?.length > 0) {
      setFetchedData({ ...fetchedData, tabs: tabs, tabLength: tabs?.length });
    }
  }, [tabs]);
  useEffect(() => {
    if (
      fetchedData?.filterItem &&
      typeof fetchedData?.filterItem === "string"
    ) {
      if (fetchedData?.filter?.id === "0") {
        sorting(categories);
      } else if (fetchedData?.filter?.id === "6" && attributes?.data) {
        sorting(attributes?.data);
      } else if (fetchedData?.filter?.id === "1" && brands?.data) {
        sorting(brands?.data);
      } else if (fetchedData?.filter?.id === "7" && blogCategories?.data) {
        sorting(blogCategories?.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchedData?.filterItem,
    categories,
    attributes?.data,
    brands?.data,
    blogCategories?.data,
  ]);
  const sorting = (datass) => {
    const idsArray = fetchedData?.filterItem.split(",");
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

  return {
    loadingFetchData: loading,
    error,
    fetchedData,
    gallery,
    allData,
    allData2,
    contents,
    setAllData,
  };
};
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
