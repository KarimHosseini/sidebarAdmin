import { Download } from "@mui/icons-material";
import { Box, CircularProgress, Fade, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton,
  MultipleImages,
  PageTitle,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  GET_WHITE_LIST_USER,
  INSET_IMAGE_WHITE_LIST_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import ShowImageDocumnt from "./image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const WhiteListDocumnt = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [searchParams, setSearchParams] = useSearchParams();
  const guarantorId = searchParams.get("guarantorId");
  const guarantorName = searchParams.get("guarantorName");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [userName, setUserName] = useState();
  const [files, setFiles] = useState([]);
  const [resizing, setresizing] = useState(false);
  const [selectedProductImage, setselectedProductImage] = useState([]);

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = () => {
    setLoading(true);
    axiosInstance
      .get(`${baseUrl}/${GET_WHITE_LIST_USER}?id=${id}`, configReq(token))
      .then((res) => {
        setData(res.data.data);
        setUserName(res.data.data.fullName);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const submitImages = async () => {
    setIsLoading(true);
    const uploadPromises = [];

    selectedProductImage.forEach((item) => {
      uploadPromises.push(
        axiosInstance.post(
          `${baseUrl}/${INSET_IMAGE_WHITE_LIST_USER}`,
          {
            whiteListUserId: id,
            fromGallery: item,
          },
          configReq(token)
        )
      );
    });

    files.forEach((item) => {
      uploadPromises.push(
        axiosInstance.post(
          `${baseUrl}/${INSET_IMAGE_WHITE_LIST_USER}`,
          {
            whiteListUserId: id,
            files: item,
          },
          configReq(token)
        )
      );
    });

    try {
      await Promise.all(uploadPromises);
      getData();
      setselectedProductImage([]);
      setFiles([]);
      toast.success("تصاویر با موفقیت آپلود شدند");
    } catch (error) {
      toast.error("خطا در آپلود تصاویر");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `document-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div>
      <PageTitle
        broadCrumb={[
          {
            title: "  تسهیلات",
            path: "/facilitySetting",
          },
          {
            title: "تضمین کننده ها",
            path: "/guarantor",
          },
          {
            title: `لیست کاربران سفید` + `برای ${guarantorName} `,
            path: `/whiteListUser?guarantorId=${guarantorId}&guarantorName=${guarantorName}`,
          },
        ]}
        title={"مستندات"}
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
          className="relative"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            <>
              <Box className="mb-6">
                <Typography
                  variant="h6"
                  className="mb-4 font-bold text-gray-700 border-b pb-2"
                >
                  تصاویر فعلی:
                </Typography>

                {data?.galleries?.length === 0 || !data?.galleries ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <i className="text-red-600 text-lg"> بدون تصویر</i>
                  </motion.div>
                ) : (
                  <motion.div
                    className="grid md:grid-cols-3 sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {data?.galleries?.map((image, index) => (
                      <ShowImageDocumnt
                        address={image}
                        id={image}
                        refresh={() => {
                          var temp = [...data.galleries];
                          temp.splice(index, 1);
                          setData({ ...data, galleries: temp });
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </Box>

              {userPermissions?.whiteListUser?.editDoc && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <Typography
                      variant="h6"
                      className="mb-4 font-bold text-gray-700"
                    >
                      افزودن تصاویر جدید:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <MultipleImages
                        setFiles={setFiles}
                        files={files}
                        setResizing={setresizing}
                        resizing={resizing}
                        selectedProductImage={selectedProductImage}
                        setselectedProductImage={setselectedProductImage}
                      />
                      <div className="flex sm:justify-start justify-end w-full sm:w-auto mt-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ActionButton
                            disable={
                              (files.length === 0 &&
                                selectedProductImage.length === 0) ||
                              isLoading
                            }
                            click={submitImages}
                            loading={isLoading}
                          />
                        </motion.div>
                      </div>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </>
          )}
        </Paper>

        {previewImage && (
          <Fade in={Boolean(previewImage)}>
            <div
              className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
              onClick={closePreview}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg"
                    onClick={() => handleDownload(previewImage)}
                  >
                    <Download />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white p-2 rounded-full shadow-lg"
                    onClick={closePreview}
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default WhiteListDocumnt;
