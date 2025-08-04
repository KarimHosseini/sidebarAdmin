import { useState, useEffect } from 'react';
import axiosInstance from '../../../dataFetch/axiosInstance';
import { configReq } from '../../../../helpers/functions';
import {
  baseUrl,
  GET_BLOG_URL,
  GET_BLOG_CATEGORY,
  GET_SHOWCASES_TYPE,
  GET_SHOWCASES_URLS,
  BRANDS,
  PUBLIC_ATTRS,
} from '../../../../helpers/api-routes';

export const useShowcaseData = (token) => {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch blog URLs
        const blogRes = await axiosInstance(
          `${baseUrl}/${GET_BLOG_URL}?Page=1&Limit=2000`,
          configReq(token)
        );
        const blogUrls = blogRes.data.data.map((item) => item.url);
        setAllUrl((prev) => [...prev, ...blogUrls]);

        // Fetch blog categories
        const blogCatRes = await axiosInstance(
          `${baseUrl}/${GET_BLOG_CATEGORY}`,
          configReq(token)
        );
        setBlogCategories(blogCatRes.data.data);

        // Fetch showcase types
        const showcaseRes = await axiosInstance(
          `${baseUrl}/${GET_SHOWCASES_TYPE}`,
          configReq(token)
        );
        setShowCaseType(showcaseRes.data.data);

        // Fetch showcase URLs
        const urlsRes = await axiosInstance(
          `${baseUrl}/${GET_SHOWCASES_URLS}`,
          configReq(token)
        );
        setAllUrl((prev) => [...prev, ...urlsRes.data.data]);

        // Fetch brands
        const brandsRes = await axiosInstance(
          `${baseUrl}/${BRANDS}`,
          configReq(token)
        );
        setBrands(brandsRes.data.data);

        // Fetch attributes
        const attrsRes = await axiosInstance(
          `${baseUrl}/${PUBLIC_ATTRS}`,
          configReq(token)
        );
        setAttributes(attrsRes.data.data);

      } catch (error) {
        console.error('Error fetching showcase data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token]);

  return {
    loading,
    categories,
    blogCategories,
    showCaseType,
    attributes,
    brands,
    allUrl,
  };
};
